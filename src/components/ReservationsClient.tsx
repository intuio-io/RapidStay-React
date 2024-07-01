import { useCallback, useState } from "react"
import toast from "react-hot-toast"

// components
import Heading from "./Heading"
import Container from "./Container"
import ListingCard from "./listings/ListingCard"

// utils
import axiosClient from "../utils/axios-client"

// hooks
import useConfirmModal from "../hooks/useConfirmModal"

interface ReservationsClientProps {
    reservations: any[];
    currentUser?: any;
  }
  
  const ReservationsClient: React.FC<ReservationsClientProps> = ({reservations, currentUser}) => {
    const { onOpen, onClose, onLoading } = useConfirmModal();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
      setDeletingId(id);
      onLoading();
      axiosClient.delete(`/reservation/delete/${id}`).then(({ data }) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      }).finally(() => {
        setDeletingId("");
        onClose();
      })
    }, [])

  return (
    <Container>
    <Heading
      title="Reservations"
      subtitle="Bookings on your properties"
    />
    <div className='mt-10 grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
      {reservations.map((reservation) => {
          return (<ListingCard
                    key={reservation.id}
                    data={reservation.listing}
                    reservation={reservation}
                    actionId={reservation.id}
                    onAction={(id) => onOpen(() => onCancel(id))}
                    disabled={deletingId === reservation.id}
                    actionLabel='Cancel guest reservation'
                    currentUser={currentUser}
        />)
        })
      }
    </div>
  </Container>
  )
}

export default ReservationsClient
