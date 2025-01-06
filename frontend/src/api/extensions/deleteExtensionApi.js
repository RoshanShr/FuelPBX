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

const userApi = axios.create({
    baseURL: apiUrl
});



export const deleteExtension = async ({
    loggedData,
    id
}) => {
    try {
        const response = await userApi.delete("/extensions", {
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
    }

}


export const useDeleteExtension = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((id) => deleteExtension({
        loggedData,
        id
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("extensions");
            notify("success", "Extension deleted successfully")
        },
        onError: (error) => {
            notify("error", `Error while deleting extension:${error.message}`)
        },
    });
}