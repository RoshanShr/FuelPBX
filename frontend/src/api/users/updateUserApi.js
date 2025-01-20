import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';
import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);


export const updateUser = async (
    data
) => {
    await apiClient.put(`/users/${data.userData.id}`, data.userData);

}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation((userData) => updateUser({
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