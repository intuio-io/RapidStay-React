import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { GoogleMap, OverlayView, OverlayViewF, useLoadScript } from '@react-google-maps/api';
import Pusher from "pusher-js";
import { io } from 'socket.io-client';

// components
import EmptyState from "../components/EmptyState";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";
import ListingLoader from "../components/listings/ListingLoader";
import MapMarker from "../components/MapMarker";
import ListingMapMenu from "../components/listings/ListingMapMenu";

// actions
import { getListings } from "../store/actions/listingActions";

// hooks
import useHomeStore from "../store/homeStore";


  const Home = () => {
    const { user, location } = useHomeStore();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapListings, setMapListings] = useState<any[]>([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isLoadingFinished, setIsLoadingFinished] = useState(false);
    const loadingTime = Number(import.meta.env.VITE_LOADING_TIME) || 1000;
    
    const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GEOLOCATION_API_KEY || '' });

    const [searchParams] = useSearchParams();
    const locationValue = searchParams?.get('locationValue');

    const [mapCenter, setMapCenter] = useState<any>({});
    const [showPopup, setShowPopup] = useState(false);
    const [mapBounds, setMapBounds] = useState<any>(null);
    const [listingId, setListingId] = useState<string>("");
    const [currentZoom, setCurrentZoom] = useState<number>(10); 

    const mapRef = useRef<any>(null);  

    const fetchDetails = useCallback(async () => {
      const params = Object.fromEntries(searchParams.entries())
      const listings = await getListings({setLoading, params});
      setListings(listings);
      setIsEmpty(!(listings.length > 0));
    }, [user, searchParams]);

    useEffect(() => {
      if (location?.latlng) {
        setMapCenter({ lat: location.latlng[0], lng: location.latlng[1] });
      }
    }, [location]);

    useEffect(() => {
      fetchDetails();

    }, [fetchDetails, searchParams, user])

    useEffect(() => {
      if (import.meta.env.VITE_SOCKET_TYPE === 'ExpressSocket') {
        const socket = io(import.meta.env.VITE_API_BASE_URL);
        socket.on("listingsUpdated", () => fetchDetails());
        return () =>  {
          socket.off('listingsUpdated');
          socket.disconnect();
        }
      }
    }, [user, fetchDetails]);


    useEffect(() => {
      if (import.meta.env.VITE_SOCKET_TYPE === 'LaravelPusher') {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
          cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        });
  
        const channel = pusher.subscribe('listing-channel');

        channel.bind('listingsUpdated', () => fetchDetails());
  
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
      }
    }, [user, fetchDetails])


        // just to give the loader a cool effect
        useEffect(() => {
            if (!loading) {
            const timeout = setTimeout(() => {
                setIsLoadingFinished(true);
            }, loadingTime); 

            return () => clearTimeout(timeout);
            }
        }, [loading]);

        useEffect(() => {
          let currentData = listings.filter((listing) => mapBounds && mapBounds.contains({ lat: listing.locationValue.latlng[0], lng: listing.locationValue.latlng[1] }));
          currentData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

          if (currentZoom < 5)  currentData = currentData.slice(0, 3);
          else if (currentZoom < 6)  currentData = currentData.slice(0, 6);
          else if (currentZoom < 7)  currentData = currentData.slice(0, 8);
        
          setMapListings(currentData);
        }, [mapBounds, currentZoom]);

        if(loading || !isLoadingFinished) {
            return ( <ListingLoader count={9}/> )
          }
        
          if(isEmpty) {
            return <EmptyState showReset/>
          }
        
          const handleBoundsChanged = () => {
            if (mapRef.current) {
              setMapBounds(mapRef.current.getBounds());
              setCurrentZoom(mapRef.current.getZoom()); // Update the zoom level
            }
          };
        
          const handleMarkerClick = (listing: any) => {
            setShowPopup(true);
            setListingId(listing.id);
          };
        
          const handleClosePopup = () => {
            setShowPopup(false);
            setListingId("");
          };
        
          if(location && locationValue) {
            return (
              <div className="flex flex-col md:flex-row">
              <div className="w-full lg:w-3/5 overflow-y-auto">
                <Container>
                  <div className="pt-24 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {mapListings.map((listing: any) => {
                      return <ListingCard
                        currentUser={user}
                        key={listing.id}
                        data={listing}
                      />
                    })}
                </div>
              </Container>
            </div>
        
         {isLoaded && mapCenter.lat && mapCenter.lng ? (   
            <div className="fixed top-24 right-0 md:w-2/5 h-screen hidden lg:block">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '90vh' }}
                  center={mapCenter}
                  zoom={6}
                  onBoundsChanged={handleBoundsChanged}
                  onLoad={(map: any) => mapRef.current = map}
                  mapTypeId='roadmap' // Set the map type to satellite
                >
              {mapListings.map((listing) => {
                return (
                <OverlayViewF
                  key={listing.id}
                  position={{ lat: listing.locationValue.latlng[0], lng: listing.locationValue.latlng[1] }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                <>
        
                  <div className="relative">
                  {showPopup && listingId === listing.id &&  
                  <div className="z-50 absolute bottom-[calc(140%)] left-1/2 transform -translate-x-1/2 w-[17rem] xl:w-[20rem]">
                      <ListingMapMenu data={listing} user={user} onClose={handleClosePopup}/>
                   </div>
                    }
                      <MapMarker isActive={listingId === listing.id} listing={listing} onClick={() => handleMarkerClick(listing)} />
                  </div>
        
                </>
                </OverlayViewF>)
              })}
                </GoogleMap>
              </div>) : 
              
              <div>Loading...</div>}
            </div>
            )
          }


  return (
    <>
    <Container>
      <div className="pt-24 grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {listings.map((listing: any) => {
                return <ListingCard
                  currentUser={user}
                  key={listing.id}
                  data={listing}
                />
              })}
      </div>
      </Container>
    </>
  )
}

export default Home
