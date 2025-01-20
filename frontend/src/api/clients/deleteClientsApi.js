import {
    useMutation
} from '@tanstack/react-query';

import {
    toast
} from 'react-toastify';
import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);

export const useDeleteClient = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await apiClient.delete("/clients", {
                data: {
                    id: id
                }
            });
            return response
        },

        onSuccess: () => {
            notify("success", "Client deleted successfully")

        },
        onError: (error) => {
            notify("error", `Error while deleting client:${error.message}`)
        },
        enabled: !!localStorage.getItem('accessToken'), // Conditional fetching (optional)
    });
};