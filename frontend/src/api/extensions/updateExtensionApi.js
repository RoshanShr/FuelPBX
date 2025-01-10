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


export const updateExtension = async (
    data
) => {
    await clientApi.put(`/extensions/${data.extensionData.id}`, data.extensionData, {
        headers: {
            "Authorization": `Bearer ${data.loggedData.loggedUser.accessToken}`
        }
    });

}


export const useUpdateExtension = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((extensionData) => updateExtension({
        loggedData,
        extensionData
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("extensions");
            notify("success", "Extension updated successfully")
        },
        onError: (error) => {
            notify("error", `Error while updating extension:${error.message}`)
        },
    });
};