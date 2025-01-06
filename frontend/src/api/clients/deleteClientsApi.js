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




export const deleteClient = async ({
    loggedData,
    id
}) => {
    try {
        const response = await clientApi.delete("/clients", {
            headers: {
                "Authorization": `Bearer ${loggedData.loggedUser.token}`
            },
            data: {
                id: id
            }
        });

        return response;

    } catch (error) {
        return error;
        // if (error.response) {
        //     // Log the status code and additional error details
        //     console.error(`Error Status Code: ${error.response.status}`);
        //     console.error(`Error Response Data:`, error.response.data);
        // } else {
        //     // General errors without a response (e.g., network issues)
        //     console.error("Error:", error.message);
        // }

        // throw error; // Re-throw the error to handle it where the function is called
    }

}




export const useDeleteClient = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((id) => deleteClient({
        loggedData,
        id
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("clients");
            notify("success", "Client deleted successfully")
        },
        onError: (error) => {
            notify("error", `Error while deleting client:${error.message}`)
        },
    });
}