import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// components
import EmptyState from '../components/EmptyState'
import ListingClient from '../components/ListingClient'
import Loader from '../components/Loader'

// actions
import { getReservations } from '../store/actions/reservationActions'
import { getListingDetails } from '../store/actions/listingActions'

// hooks
import useHomeStore from '../store/homeStore'

const Listing = () => {
  const params = useParams();
  const {user} = useHomeStore();
  const [listing, setListing] = useState([]);
  const [listingLoading, setListingLoading] = useState<boolean>(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [resLoading, setResLoading] = useState<boolean>(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const loadingTime = Number(import.meta.env.NEXT_PUBLIC_LOADING_TIME) || 1000;

  useEffect(() => {
    const fetchDetails = async () => {
        const data = await getListingDetails({setListingLoading, params});
        setListing(data);
    }

    fetchDetails();
}, []);

useEffect(() => {
  const fetchReservations = async () => {
     const data = await getReservations({setResLoading, params})
     setReservations(data);
  };

  fetchReservations();
}, []);

        // just to give the loader a cool effect
     useEffect(() => {
      if (!listingLoading && !resLoading) {
            const timeout = setTimeout(() => {
              setIsLoadingFinished(true);
            }, loadingTime); 
      
            return () => clearTimeout(timeout);
          }
        }, [listingLoading, resLoading]);

        if(!isLoadingFinished || listingLoading || resLoading) {
          return <Loader/>
      }
  
      if(listing.length === 0) {
          return <EmptyState/>
      }  

  return (
    <ListingClient listing={listing} reservations={reservations} currentUser={user}/>
  )
}

export default Listing
