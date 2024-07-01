import  { useState, useEffect, useCallback } from 'react'
import Pusher from 'pusher-js';
import { io } from 'socket.io-client';

// components
import TripsClient from '../components/TripsClient'
import EmptyState from '../components/EmptyState'
import ListingLoader from '../components/listings/ListingLoader'

// hooks
import useHomeStore from '../store/homeStore'

// actions
import { getReservations } from '../store/actions/reservationActions'

const Trips = () => {
    const { user } = useHomeStore();
    const [reservations, setReservations] = useState<any[]>([]);
    const [resLoading, setResLoading] = useState<boolean>(false);
    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;

    const fetchReservations = useCallback(async () => {
      const params = { userId: user?.id };
      const data = await getReservations({ setResLoading, params });
      setReservations(data);
    }, [user?.id]);

    useEffect(() => {
      if(!user) return;
      fetchReservations();
    }, [user?.email]);


    useEffect(() => {
      if(!user) return;
      if (import.meta.env.VITE_SOCKET_TYPE === 'ExpressSocket') {
        const socket = io(import.meta.env.VITE_API_BASE_URL);
        socket.on("reservationsDeleted", () => fetchReservations());
        return () => {
          socket.off('reservationsDeleted');
          socket.disconnect();
        }
      }
    }, [user?.email])


  useEffect(() => {
    if(!user) return;
    if (import.meta.env.VITE_SOCKET_TYPE === 'LaravelPusher') {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      });

      const channel = pusher.subscribe('reservation-channel');

      channel.bind('reservationsDeleted', () => fetchReservations());

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [user?.email]);

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
            return <ListingLoader showButton count={6}/>
          }
          
          if(!user) return <EmptyState title="Unauthorized" subtitle="Please login"/>
          
          if (reservations.length === 0 ) {
            return <EmptyState title="No trips found" subtitle="Looks like you haven't reserved any trips."/>
          }

  return (
    <TripsClient 
        reservations={reservations}
        currentUser={user}
    />
  )
}

export default Trips
