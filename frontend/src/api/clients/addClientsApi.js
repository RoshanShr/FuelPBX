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


export const addClient = async (
    data
) => {
    await clientApi.post("/clients", data.clientData, {
        headers: {
            "Authorization": `Bearer ${data.loggedData.loggedUser.token}`
        }
    });

}


export const useAddClient = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((clientData) => addClient({
        loggedData,
        clientData
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("clients");
            notify("success", "Client added successfully")
        },
        onError: (error) => {
            notify("error", `Error while adding client:${error.message}`)
        },
    });
};