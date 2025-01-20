import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';

import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);


export const updateExtension = async (
    data
) => {
    await apiClient.put(`/extensions/${data.extensionData.id}`, data.extensionData);
}


export const useUpdateExtension = () => {
    const queryClient = useQueryClient();
    return useMutation((extensionData) => updateExtension({
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