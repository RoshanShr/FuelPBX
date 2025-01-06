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


export const addUser = async (
    data
) => {
    await clientApi.post("/users", data.userData, {
        headers: {
            "Authorization": `Bearer ${data.loggedData.loggedUser.token}`
        }
    });

}


export const useAddUser = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((userData) => addUser({
        loggedData,
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