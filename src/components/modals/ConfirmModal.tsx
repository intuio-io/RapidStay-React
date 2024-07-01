// components
import Modal from "./Modal"
import Heading from "../Heading"

// hooks
import useConfirmModal from "../../hooks/useConfirmModal"

const ConfirmModal = () => {
const { isOpen, isLoading, onClose, onConfirm } = useConfirmModal();

const bodyContent = (
    <Heading
        title='Confirmation Request'
        subtitle="Are you sure you want to continue with your action?"
    /> 
)
  return (
    <Modal 
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onConfirm}
        actionLabel='Confirm'
        disabled={isLoading}
        secondaryActionLabel='Cancel'
        secondaryHandleClose={true}
        title="Confirmation"
        body={bodyContent}
    />
  )
}

export default ConfirmModal
