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


export const updateUser = async (
    data
) => {
    await clientApi.put(`/users/${data.userData.id}`, data.userData, {
        headers: {
            "Authorization": `Bearer ${data.loggedData.loggedUser.token}`
        }
    });

}


export const useUpdateUser = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((userData) => updateUser({
        loggedData,
        userData
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            notify("success", "User updated successfully")
        },
        onError: (error) => {
            notify("error", `Error while updating user:${error.message}`)
        },
    });
};