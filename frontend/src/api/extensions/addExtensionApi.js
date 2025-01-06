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


export const addExtension = async (
    data
) => {
    await clientApi.post("/extensions", data.extensionData, {
        headers: {
            "Authorization": `Bearer ${data.loggedData.loggedUser.token}`
        }
    });

}


export const useAddExtension = (loggedData) => {
    const queryClient = useQueryClient();
    return useMutation((extensionData) => addExtension({
        loggedData,
        extensionData
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("extensions");
            notify("success", "Extension added successfully")
        },
        onError: (error) => {
            if(error.status==402){
                notify("error", `Extension limit exceeded`)
            }else{
                notify("error", `Error while adding extension:${error.message}`)
            }
        },
    });
};