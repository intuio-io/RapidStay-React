import {useCallback, useEffect, useMemo, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { Range } from 'react-date-range';

import { categories } from './navbar/Categories';

// components
import Container from './Container';
import ListingHead from './listings/ListingHead';
import ListingInfo from './listings/ListingInfo';
import ListingReservation from './listings/ListingReservation';

// hooks
import useLoginModal from '../hooks/useLoginModal';

// utils
import axiosClient from '../utils/axios-client';
import toast from 'react-hot-toast';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  };
  
  interface ListingClientProps {
      reservations?: any;
      listing: any;
      currentUser?: any;
  }

  const ListingClient: React.FC<ListingClientProps> = ({reservations = [], listing, currentUser}) => {
    const loginModal = useLoginModal();
    const navigate = useNavigate();

    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservations: any) => {
            const range = eachDayOfInterval({
                start: new Date(reservations.startDate),
                end: new Date(reservations.endDate)
            });

            dates = [ ...dates, ...range ];
        });

        return dates;
    }, [reservations]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if(!currentUser) {
            return loginModal.onOpen();
        }

        setIsLoading(true);
        axiosClient.post('/reservation/addReservation', {
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing.id
        })
        .then(() => {
            toast.success('Listing reserved');
            setDateRange(initialDateRange);
            navigate('/trips');
        })
        .catch(() => {
            toast.error("Something went wrong.");
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [totalPrice, dateRange, listing?.id, navigate, currentUser, loginModal]);

    useEffect(() => {
        if(dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category);
    }, [listing.category])

  return (
    <Container>
    <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col gap-6'>
            <ListingHead
                title={listing.title}
                imageSrc={listing.imageSrc}
                locationValue={listing.locationValue.value}
                id={listing.id}
                currentUser={currentUser}
            />
            <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                <ListingInfo 
                    user={listing.user}
                    category={category}
                    description={listing.description}
                    roomCount={listing.roomCount}
                    guestCount={listing.guestCount}
                    bathroomCount={listing.bathroomCount}
                    locationValue={listing.locationValue.value}
                />
                <div className='order-first mb-10 md:order-last md:col-span-3'>
                    <ListingReservation
                        price={listing.price}
                        totalPrice={totalPrice}
                        onChangeDate={(value) => setDateRange(value)}
                        dateRange={dateRange}
                        onSubmit={onCreateReservation}
                        disabled={isLoading}
                        disabledDates={disabledDates}
                    />
                </div>
            </div>
        </div>
    </div>
</Container>
  )
}

export default ListingClient
