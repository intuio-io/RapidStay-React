import { useState, useEffect } from 'react'

// components
import EmptyState from '../components/EmptyState'
import FavoritesClient from '../components/FavoritesClient'
import ListingLoader from '../components/listings/ListingLoader'

// hooks
import useHomeStore from '../store/homeStore'

// actions
import { getFavoriteListings } from '../store/actions/listingActions'

const Favorites = () => {
  const {user} = useHomeStore();
  const [ listings, setListings ] = useState<any[]>([]);
  const [listingLoading, setListingLoading] = useState<boolean>(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;

  useEffect(() => {
    if(!user) return;

    const fetchFavorites = async () => {
        const data = await getFavoriteListings({ setListingLoading })
        setListings(data);
    }

    fetchFavorites();
}, [user])

    // just to give the loader a cool effect
    useEffect(() => {
      if (!listingLoading) {
        const timeout = setTimeout(() => {
          setIsLoadingFinished(true);
        }, loadingTime); 
  
        return () => clearTimeout(timeout);
      }
    }, [listingLoading]);

    if(listingLoading || !isLoadingFinished) {
      return <ListingLoader showButton count={7}/>
  }

  if(!user) return <EmptyState title="Unauthorized" subtitle="Please login"/>

  if(listings.length === 0) {
      return <EmptyState title="No favorites found" subtitle="Looks like you have no favorite listings"/>
  }


  return (
    <FavoritesClient
        listings={listings}
        currentUser={user}
    />
  )
}

export default Favorites
