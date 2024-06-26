import  { useState, useEffect } from 'react'

// components
import TripsClient from '../components/TripsClient'
import EmptyState from '../components/EmptyState'
import ListingLoader from '../components/listings/ListingLoader'

// hooks
import useHomeStore from '../store/homeStore'
import useSocket from '../hooks/useSocket'

// actions
import { getReservations } from '../store/actions/reservationActions'


const Trips = () => {
    const { user } = useHomeStore();
    const [reservations, setReservations] = useState<any[]>([]);
    const [resLoading, setResLoading] = useState<boolean>(false);
    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;
    const socket = useSocket(import.meta.env.VITE_API_BASE_URL);

    useEffect(() => {
        if(!user) return;
  
        const fetchReservations = async () => {
          const params = { userId: user.id }
          const data = await getReservations({setResLoading, params})
          setReservations(data);
       };
       fetchReservations();

       if (socket) socket.on("reservationsDeleted", () => fetchReservations());

       return () =>  {socket && socket.off('reservationsDeleted');}
      }, [user, socket])

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
