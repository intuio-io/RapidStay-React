import { useCallback, useState, useEffect, useRef } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// icons
import { AiOutlineMenu } from 'react-icons/ai';

// components
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

// hooks
import useHomeStore from "../../store/homeStore";
import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import useRentModal from "../../hooks/useRentModal";

// utils
import axiosClient from "../../utils/axios-client";

interface UserMenuProps {
    currentUser?: Object | any
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
    const navigate = useNavigate();
    const { reset } = useHomeStore();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();
    const [isOpen, setIsOpen] = useState(false);
    let menuRef = useRef<any>();

    useEffect(() => {
        let handler = (e: any) => {
            if (!menuRef.current?.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
    }, [isOpen]);

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const logout = () => {
        axiosClient.post('/auth/signOut').then(({data}) => 
            {
                localStorage.removeItem("ACCESS_TOKEN");
                toast.success(data?.message);
                reset();
                navigate("/");
            }).catch(() => {
                localStorage.removeItem("ACCESS_TOKEN");
                toast.error("Something went wrong")
            })
    }

    const onRent = useCallback(() => {
        if(!currentUser) {
          return  loginModal.onOpen();
        }

        // Open Rent Modal
        rentModal.onOpen();
    }, [currentUser, loginModal, rentModal])

  return (
    <div className='relative'>
        <div className='flex flex-row items-center gap-3'>
            <div onClick={onRent} className='hidden md:block text-sm font-semibold py-3 px-4  rounded-full hover:bg-neutral-100 transition cursor-pointer'>
                RapidStay your home
            </div>
            <div onClick={toggleOpen} className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'>
                <AiOutlineMenu/>
                <div className='hidden md:block'>
                    <Avatar/>
                </div>
            </div>
        </div>

        {isOpen && (
            <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm' ref={menuRef}>
                <div className='flex flex-col cursor-pointer'>
                  { currentUser ? (
                  <>
                      <MenuItem label={currentUser?.email}/>
                      <MenuItem onClick={() => navigate("/trips")} label="My trips"/>
                      <MenuItem onClick={() => navigate("/favorites")} label="My favorites"/>
                      <MenuItem onClick={() => navigate("/reservations")} label="My reservations"/>
                      <MenuItem onClick={() => navigate("/properties")} label="My properties"/>
                      <MenuItem onClick={rentModal.onOpen} label="RapidStay my home"/>
                      <hr/>
                      <MenuItem onClick={() => logout()} label="Logout"/>
                  </>
                  ) :
                  <>
                    <MenuItem onClick={loginModal.onOpen} label="Login"/>
                    <MenuItem onClick={registerModal.onOpen} label="Sign up"/>
              </>}
                </div>
            </div>
        )}
    </div>
  )
}

export default UserMenu
