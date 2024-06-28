import axiosClient from "../utils/axios-client";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

// hooks
import useLoginModal from "./useLoginModal";
import useHomeStore from "../store/homeStore";

interface IUserFavorite {
    listingId: string;
    currentUser?: any;
}

const useFavorite = ({listingId, currentUser}: IUserFavorite) => {
    const navigate = useNavigate();
    const loginModal = useLoginModal();
    const { addFavoriteId, removeFavoriteId } = useHomeStore();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId);
    },[currentUser, listingId])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if(!currentUser) {
            return loginModal.onOpen();
        }

        try {
            let request;

            if (hasFavorited) {
                request = axiosClient.delete(`/auth/removeFavorite/${listingId}`)
                  .then(({ data }) => {
                    removeFavoriteId(listingId);
                    toast.success(data.message);
                  });
              } else {
                request = axiosClient.post(`/auth/addFavorite/${listingId}`)
                  .then(({ data }) => {
                    addFavoriteId(listingId);
                    toast.success(data.message);
                  });
              }

            await request;

        } catch (error) {
            toast.error("Something went wrong")
        }
    }, [currentUser, hasFavorited, listingId, loginModal, navigate])

    return {hasFavorited, toggleFavorite};
}

export default useFavorite;