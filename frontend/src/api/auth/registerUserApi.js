import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';
import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);


export const registerUser = async (
    data
) => {
    await apiClient.post("/register", data.data);
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