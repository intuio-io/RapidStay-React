import axiosClient from "../../utils/axios-client";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface GetListingsParams {
    setLoading: Dispatch<SetStateAction<boolean>>;
    params?: { [key: string]: any };
  }

  export const getListings = async ({ setLoading, params }: GetListingsParams): Promise<any> => {
    try {
        setLoading(true);
        const response = await axiosClient.get('/listing/getListings', {
            params: params
        });
        return response.data;
    } catch (error) {
        toast.error('Error fetching listing');
    } finally {
        setLoading(false);
    }
  }

interface ListingDetailParams {
    setListingLoading: Dispatch<SetStateAction<boolean>>;
    params: { [key: string]: any };
  }

  export const getListingDetails = async ({ setListingLoading, params }: ListingDetailParams): Promise<any> =>
    {
        try {
            setListingLoading(true);
            const response = await axiosClient.get(`/listing/${params.listingId}`);
            return response.data;
        } catch (error: any) {
            toast.error("Error fetching Property details");
            return [];
        } finally {
            setListingLoading(false);
        }
  };

  interface GetListingFavoritesParams {
    setListingLoading: Dispatch<SetStateAction<boolean>>;
  }

  export const getFavoriteListings = async ({ setListingLoading }: GetListingFavoritesParams): Promise<any> => 
    {
        try {
            setListingLoading(true);
            const response = await axiosClient.get('/listing/getFavorites');
            return response.data;
        } catch (error: any) {
            toast.error("Error fetching favorite listings");
        } finally {
            setListingLoading(false);
        }
       
  }