import { useState, useEffect, useCallback } from "react"
import Pusher from "pusher-js";
import { io } from 'socket.io-client';

// components
import EmptyState from "../components/EmptyState"
import ReservationsClient from "../components/ReservationsClient"
import ListingLoader from "../components/listings/ListingLoader"

// hooks
import useHomeStore from "../store/homeStore"

// actions
import { getReservations } from "../store/actions/reservationActions"


const Reservations = () => {
  const { user } = useHomeStore();
  const [reservations, setReservations] = useState<any[]>([]);
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;

  const fetchReservations = useCallback(async () => {
    const params = { authorId: user.id };
    const data = await getReservations({ setResLoading, params });
    setReservations(data);
  }, [user]);

  useEffect(() => {
    if(!user) return;

    fetchReservations();
  }, [user, fetchReservations])

  useEffect(() => {
    if (!user) return;

    if (import.meta.env.VITE_SOCKET_TYPE === 'ExpressSocket') {
      const socket = io(import.meta.env.VITE_API_BASE_URL);
      socket.on("reservationsUpdated", () => fetchReservations());
      socket.on("reservationsDeleted", () => fetchReservations());
      return () => {
        socket.off("reservationsUpdated")
        socket.off('reservationsDeleted');
        socket.disconnect();
      }
    }
  }, [user, fetchReservations])

  useEffect(() => {
    if (!user) return;

    if (import.meta.env.VITE_SOCKET_TYPE === 'LaravelPusher') {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      });

      const channel = pusher.subscribe('reservation-channel');

      channel.bind('reservationsUpdated', () => fetchReservations());
      channel.bind('reservationsDeleted', () => fetchReservations());

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [fetchReservations, user]);


        // just to give the loader a cool effect
        useEffect(() => {
          if (!resLoading) {
            const timeout = setTimeout(() => {
              setIsLoadingFinished(true);
            }, loadingTime); 
      
            return () => clearTimeout(timeout);
          }
        }, [resLoading]);

        if(resLoading || !isLoadingFinished) {
          return <ListingLoader showButton count={4}/>
      }
  
      if(!user) {
          return <EmptyState
              title="Unauthorized"
              subtitle="Please login"    
          />
      }
  
      if(reservations.length === 0) {
          return <EmptyState
              title="No reservations found"
              subtitle="Looks like you have no reservations on your properties"
          />
      }

  return (
    <ReservationsClient 
        reservations={reservations}
        currentUser={user}
    />
  )
}

export default Reservations
