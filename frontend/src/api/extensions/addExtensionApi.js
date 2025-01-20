import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';
import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);


export const addExtension = async (
    data
) => {
    await apiClient.post("/extensions", data.extensionData);

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