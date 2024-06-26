import React, { useState, useMemo, useEffect, Suspense } from "react"

// components
import Avatar from "../Avatar"
import ListingCategory from "./ListingCategory"

// icons
import { IconType } from "react-icons"

// hooks
import useCountries from "../../hooks/useCountries"

interface ListingInfoProps {
    user: any;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined;
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ user, description, guestCount, roomCount, bathroomCount, category, locationValue}) => {
    const [isMapReady, setIsMapReady] = useState(true);
    const { getByValue } = useCountries();
    const coordinates = getByValue(locationValue)?.latlng;

    const Map = useMemo(() => {
        setIsMapReady(false);
        return React.lazy(() => import('../Map'));
      }, [location]);

      useEffect(() => {
        setIsMapReady(true);
      }, [location])


  return (
    <div className='col-span-4 flex flex-col gap-8'>
    <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold flex flex-row items-center gap-2'>
            <div>Hosted by {user?.name}</div>
            <Avatar/>
        </div>
        <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
            <div>
                {guestCount} guests
            </div>

            <div>
                {roomCount} rooms
            </div>

            <div>
                {bathroomCount} bathrooms
            </div>

        </div>
    </div>
  <hr/>
  {category && (
    <ListingCategory
        icon={category.icon}
        label={category.label}
        description={category.description}
    />
  )}
  <hr/>
  <div className='text-lg font-light text-neutral-500'>
    {description}
  </div>
  <hr/>
  <Suspense fallback={<div>Loading...</div>}>
            {isMapReady &&
            <Map center={coordinates} />}
    </Suspense> 
</div>
  )
}

export default ListingInfo
