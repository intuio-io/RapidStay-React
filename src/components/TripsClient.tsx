import { useCallback, useState } from 'react'
import toast from 'react-hot-toast';

// utils
import axiosClient from '../utils/axios-client';

// components
import Container from './Container';
import Heading from './Heading';
import ListingCard from './listings/ListingCard';

// hooks
import useConfirmModal from '../hooks/useConfirmModal';

interface TripsClientProps {
    reservations: any;
    currentUser?: any;
}

const TripsClient: React.FC<TripsClientProps> = ({ reservations, currentUser }) => {
  const { onOpen, onClose, onLoading } = useConfirmModal();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
      setDeletingId(id);
      onLoading();
      axiosClient.delete(`/reservation/delete/${id}`).then(({ data }) => {
          toast.success(data.message);
      })
      .catch((error) => {
          toast.error(error?.message);
      }).finally(() => {
          setDeletingId('');
          onClose();
      })
  },[])
  return (
    <Container>
        <Heading
            title="Trips"
            subtitle="Where yo've been and where you're going"
        />
        <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
            {reservations.map((reservation: any) => (
                <ListingCard 
                    key={reservation.id}
                    data={reservation.listing}
                    reservation={reservation}
                    actionId={reservation.id}
                    onAction={(id) => onOpen(() => onCancel(id))}
                    disabled={deletingId === reservation.id}
                    actionLabel='Cancel reservation'
                    currentUser={currentUser}
                />
            ))}
        </div>
    </Container>
  )
}

export default TripsClient
