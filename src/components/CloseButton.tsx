// icons
import { IoClose } from "react-icons/io5";

interface CloseButtonProps {
    onClose : () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({onClose}) => {
    return (
      <div onClick={onClose} className='relative hover:opacity-80 transition cursor-pointer'>
        <IoClose size={24} className='opacity-80 absolute -right-[2px] rounded-full bg-white'/>
      </div>
    )
  }

export default CloseButton
