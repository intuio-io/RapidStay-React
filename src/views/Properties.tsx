import  { useState, useCallback, useEffect} from 'react'
import Pusher from 'pusher-js'
import { io } from 'socket.io-client';

// components
import EmptyState from '../components/EmptyState'
import PropertiesClient from '../components/PropertiesClient'
import ListingLoader from '../components/listings/ListingLoader'

// hooks
import useHomeStore from '../store/homeStore'

// actions
import { getListings } from '../store/actions/listingActions'

const Properties = () => {
  const {user} = useHomeStore();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;

  const fetchDetails = useCallback(async () => {
    const params = {userId: user.id}
    const data = await getListings({setLoading, params});
    setListings(data);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchDetails();
  }, [user, fetchDetails])

  useEffect(() => {
    if(!user) return;

    if (import.meta.env.VITE_SOCKET_TYPE === 'ExpressSocket') {
      const socket = io(import.meta.env.VITE_API_BASE_URL);
      socket.on("listingsDeleted", () => fetchDetails());
      return () => {
        socket.off('listingsDeleted');
        socket.disconnect();
      }
    }
  }, [fetchDetails, user]);

  useEffect(() => {
    if (!user) return;

    if (import.meta.env.VITE_SOCKET_TYPE === 'LaravelPusher') {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      });

      const channel = pusher.subscribe('listing-channel');
      channel.bind('listingsDeleted', () => fetchDetails());

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [fetchDetails, user]);

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
