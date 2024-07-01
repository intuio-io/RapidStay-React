import { useNavigate } from "react-router-dom"
import React, { useCallback, useMemo } from 'react';
import { format } from "date-fns";

// hooks
import useCountries from "../../hooks/useCountries";

// components
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
    data: any;
    reservation?: any;
    onAction?: (id: string) => void;
    hoverAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: Object | null;
}

const ListingCard: React.FC<ListingCardProps> = ({data, reservation, onAction, hoverAction, disabled, actionLabel, actionId = "", currentUser}) => {
    const navigate = useNavigate();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue.value);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    
        if(disabled) return;
    
        onAction?.(actionId);
    }, [onAction, actionId, disabled]);

    const price = useMemo(() => {
        if (reservation) return reservation.totalPrice;
    
        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if(!reservation) return null;
    
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);
    
        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation]);

  return (
    <div 
        onClick={() => navigate(`/listings/${data.id}`)} 
        className='col-span-1 cursor-pointer group'
        onMouseEnter={() => hoverAction?.(data?.id)}
        onMouseLeave={() => hoverAction?.("")}
    >
    <div className='flex flex-col gap-2 w-full'>
    <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
           <img
               alt="Listing"
               src={data.imageSrc}
               className='object-cover h-full w-full group-hover:scale-110 transition'
               />
           <div className='absolute top-3 right-3'>
               <HeartButton
                   listingId={data.id}
                   currentUser={currentUser}
               />
           </div>
       </div>
       <div className='font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-full'>
         {data?.title}
       </div>


       {reservation?.user &&       
        <div className='text-neutral-500'>
            {reservation.user.email}
       </div>
       }

        <div className='font-light text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-full'>
            {data?.locationValue?.region}, {location?.label} {`| ${data.category}`}
        </div>

       {reservationDate && 
            <div className='text-neutral-500'>
            {reservationDate}
            </div>
       }

       <div className='flex flex-row items-center gap-1'>
           <div className='font-semibold'>
            ${price}
           </div>
           {!reservation && (
               <div className='font-light'>night</div>
           )}
       </div>
       {onAction && actionLabel && (
           <Button 
               disabled={disabled}
               small
               label={actionLabel}
               onClick={handleCancel}
           />
       )}
    </div>
   </div>
  )
}

export default ListingCard
