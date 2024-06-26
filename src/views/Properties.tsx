import  { useState, useEffect} from 'react'

// components
import EmptyState from '../components/EmptyState'
import PropertiesClient from '../components/PropertiesClient'
import ListingLoader from '../components/listings/ListingLoader'

// hooks
import useHomeStore from '../store/homeStore'
import useSocket from '../hooks/useSocket'

// actions
import { getListings } from '../store/actions/listingActions'

const Properties = () => {
  const {user} = useHomeStore();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;
  const socket = useSocket(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    if(!user) return;

    const fetchDetails = async () => {
        const params = {userId: user.id}
        const data = await getListings({setLoading, params});
        setListings(data);
      }
  
      fetchDetails();

      if (socket) socket.on("listingsDeleted", () => fetchDetails());

      return () =>  {socket && socket.off('listingsDeleted');}
}, [user, socket]);

        // just to give the loader a cool effect
        useEffect(() => {
          if (!loading) {
            const timeout = setTimeout(() => {
              setIsLoadingFinished(true);
            }, loadingTime); 
      
            return () => clearTimeout(timeout);
          }
        }, [loading]);

        if(loading || !isLoadingFinished) {
          return <ListingLoader showButton count={3}/>
        }
    
        if(!user) return <EmptyState title="Unauthorized" subtitle="Please login"/>
    
        if(listings.length === 0) {
            return <EmptyState title="No properties found" subtitle='Looks like you have no properties'/>
        }


  return (
    <PropertiesClient listings={listings} currentUser={user} />
  )
}

export default Properties
