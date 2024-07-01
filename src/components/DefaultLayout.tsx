import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// components
import Navbar from "./navbar/Navbar";
import SearchModal from "./modals/SearchModal";
import RegisterModal from "./modals/RegisterModal";
import LoginModal from "./modals/LoginModal";
import RentModal from "./modals/RentModal";
import ConfirmModal from "./modals/ConfirmModal";
import Footer from "./Footer";

// actions
import { getCurrentUser } from "../store/actions/authActions";

// hooks
import useHomeStore from "../store/homeStore";

const DefaultLayout = () => {
  const navigate = useNavigate();
  const { addUser, user } = useHomeStore();


  useEffect(() => {
    const fetch = async () => {
      const userDetails  = await getCurrentUser();
      if(!userDetails) {
        navigate(`/`);
        return;
      }
      addUser(userDetails);
     }
  
     fetch();
  }, [addUser])

  return (
    <div className="font-body">
        <Toaster/>
        <Navbar currentUser={user}/>
        <SearchModal/>
        <RegisterModal/>
        <LoginModal/>
        <RentModal/>
        <ConfirmModal/>


      <div className="pt-28 pb-20">
        <Outlet />
      </div>

      <Footer/>
    </div>
  )
}

export default DefaultLayout
