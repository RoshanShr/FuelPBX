import axios from "axios";
import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';

const notify = (type, msg) => toast[type](msg);

const apiUrl =
    import.meta.env.VITE_API_URL;

const clientApi = axios.create({
    baseURL: apiUrl
});


export const registerUser = async (
    data
) => {
    await clientApi.post("/register", data.data);

}

export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation((data) => registerUser({
      data
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            notify("success", "User added successfully")
        },
        onError: (error) => {
            notify("error", `Error while adding user:${error.message}`)
        },
    });
};