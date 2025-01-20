import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';

import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);


export const deleteExtension = async ({
    id
}) => {
    try {
        const response = await apiClient.delete("/extensions", {
            data: {
                id: id
            }
        });

        return response;

    } catch (error) {
        return error;
    }

}


export const useDeleteExtension = () => {
    const queryClient = useQueryClient();
    return useMutation((id) => deleteExtension({
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