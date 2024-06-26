import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// icons
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

// actions
import { getCurrentUser } from "../../store/actions/authActions";

// hooks
import useHomeStore from "../../store/homeStore";
import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";

// components
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";

// utils
import axiosClient from "../../utils/axios-client";

const RegisterModal = () => {
  const { addUser } = useHomeStore();
  const registerModal  = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/register', data);
      localStorage.setItem("ACCESS_TOKEN", response.data.token);

      const userDetails = await getCurrentUser();
      addUser(userDetails);
      toast.success('Logged in successfully!');
      reset();
      registerModal.onClose();
    } catch (error) {
      toast.error("Something went wrong, maybe email already exists!");
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading 
      title="Welcome to Airbnb" 
      subtitle='Create an account!'
       />

      <Input 
        id="email" 
        label="Email" 
        disabled={isLoading} 
        register={register} 
        errors={errors}
        required />

      <Input 
        id="name" 
        label="Name" 
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
      <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => {}}/>
      <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => {}}/>
      <div className='text-neutral-500 text-center mt-4 font-light'>
        <div className='justify-center flex flex-row items-center gap-2'>
          <div>
            Already have an account?
          </div>
          <div onClick={() => {registerModal.onClose(); loginModal.onOpen()}} className='text-neutral-800 cursor-pointer hover:underline'>
            Log in
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal 
      disabled={isLoading} 
        isOpen={registerModal.isOpen}
        title="Register"
        actionLabel="Continue"
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
        />
  )
}

export default RegisterModal
