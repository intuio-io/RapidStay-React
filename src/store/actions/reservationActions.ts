import axiosClient from "../../utils/axios-client";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface ReservationParams {
    setResLoading: Dispatch<SetStateAction<boolean>>;
    params: { [key: string]: any };
  }

  export const getReservations = async ({
    setResLoading,
    params
  }: ReservationParams): Promise<any> => {
    try {
        setResLoading(true);
      const response = await axiosClient.get('/reservation/getReservations', {
        params: params
      });
      return response.data;
    } catch (error: any) {
      toast.error("Error fetching Reservation details");
    } finally {
        setResLoading(false);
    }
  };