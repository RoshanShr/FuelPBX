import {
    useQuery
} from '@tanstack/react-query';
import apiClient from "../../utils/apiClient";


export const useGetReports = (loggedData, currentPage, itemsPerPage, disposition, callType) => {
    return useQuery({
        queryKey: ["reports", currentPage, itemsPerPage, disposition, callType], // Query key with dynamic parameters
        queryFn: async () => {
            const response = await apiClient.get(`/reports?alias=${loggedData.loggedUser.alias}&disposition=${disposition}&callType=${callType}&page=${currentPage}&limit=${itemsPerPage}`, {});
            return response.data;
        },

        onError: (error) => {
            console.error('Error fetching reports:', error);
        },
        enabled: !!localStorage.getItem('accessToken'), // Conditional fetching (optional)
        // retry: false, // Disable retrying failed requests
    });
};

// export const useGetReports = (loggedData,currentPage, itemsPerPage) => {
//     return useQuery(["reports"], () => getReports(loggedData,currentPage, itemsPerPage), {
//         onError: (error) => {
//         },
//     });
// }