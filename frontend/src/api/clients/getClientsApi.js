import {
    useQuery
} from '@tanstack/react-query';
import apiClient from "../../utils/apiClient";

// React Query Hooks

// export const useGetClients = (loggedData) => {
//     return useQuery(["clients"], () => getClient(loggedData), {
//         onError: (error) => {
//             toast.error(`Failed to fetch clients: ${error.message}`);
//         },
//     });
// };

export const useGetClients = (loggedData, currentPage, itemsPerPage) => {
    return useQuery({
        queryKey: ["clients", currentPage, itemsPerPage], // Query key with dynamic parameters
        queryFn: async () => {
            const response = await apiClient.get(`/clients?organization_id=${loggedData.loggedUser.organization_id}&isAdmin=${loggedData.loggedUser.isAdmin}&page=${currentPage}&limit=${itemsPerPage}`);
            return response.data;
        },

        onError: (error) => {
            console.error('Error fetching clients:', error);
        },
        enabled: !!localStorage.getItem('accessToken'), // Conditional fetching (optional)
        // retry: false, // Disable retrying failed requests
    });
};

