import axiosClient from "../../utils/axios-client";

export const getCurrentUser  = async () => {
    if (!localStorage.getItem("ACCESS_TOKEN")) return null;
    try {
        const { data } = await axiosClient.get('/auth/user');
        if (!data) return null;
        return data;
    } catch (error) {
        console.log(error);
    }
}