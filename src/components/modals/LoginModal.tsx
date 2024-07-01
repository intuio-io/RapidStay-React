import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from 'react-hot-toast';

// hooks
import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";

// components
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";

// utils
import axiosClient from "../../utils/axios-client";

// actions
import { getCurrentUser } from "../../store/actions/authActions";

// hooks
import useHomeStore from "../../store/homeStore";

const LoginModal = () => {
  const { addUser } = useHomeStore();
  const registerModal  = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
  
    try {
      const response = await axiosClient.post('/auth/signin', data);
      localStorage.setItem("ACCESS_TOKEN", response.data.token);
  
      const userDetails = await getCurrentUser();
      addUser(userDetails);
      toast.success(response?.data?.message);
      reset();
      loginModal.onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading 
      title="Welcome back" 
      subtitle='Login to your account!'
       />

      <Input 
        id="email" 
        label="Email"
        disabled={isLoading} 
        register={register} 
        errors={errors}
        required />

      <Input 
        id="password"
        type='password'
        label="Password" 
        disabled={isLoading} 
        register={register} 
        errors={errors}
        required />
    </div>
  )

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr/>
      <div className='text-neutral-500 text-center mt-4 font-light'>
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            Don't have an account?
          </div>
          <div onClick={() => {loginModal.onClose(); registerModal.onOpen()}} className='text-neutral-800 cursor-pointer hover:underline'>
            Register
          </div>
        </div>
      </div>
    </div>
  )


  return (
    <Modal 
      disabled={isLoading} 
        isOpen={loginModal.isOpen}
        title="Login"
        actionLabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
  )
}

export default LoginModal
