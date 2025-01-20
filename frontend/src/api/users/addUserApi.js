import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';

import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);

export const addUser = async (
    data
) => {
    await apiClient.post("/users", data.userData);
}


export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation((userData) => addUser({
        userData
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            notify("success", "User added successfully")
        },
        onError: (error) => {
            if(error.status==402){
                notify("error", `User limit exceeded`)
            }else{
                notify("error", `Error while adding user:${error.message}`)
            }
        },
    });
};