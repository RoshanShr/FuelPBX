import {
    useQuery

} from "react-query";

import apiClient from "../../utils/apiClient";

export const getUsers = async (organization_id,page, limit) => {
    const response = await apiClient.get(`/users?organization_id=${organization_id}&page=${page}&limit=${limit}`);
    return response.data;
}

export const useGetUsers = (organization_id, currentPage, itemsPerPage) => {
    return useQuery(
        ["users", organization_id, currentPage,  itemsPerPage], // Query key includes currentPage for dynamic fetching
        () => getUsers(organization_id, currentPage, itemsPerPage),
        {
          //  staleTime: 300000,  // Set staleTime to 5 minutes (in ms)
          //  cacheTime: 600000,  // Set cacheTime to 10 minutes (in ms)
           // refetchOnWindowFocus: false, // Optional: Prevent refetching when window is focused
            onError: (error) => {
                console.error('Error fetching users:', error);
            },
            // Optionally, you can add other settings, like:
            // enabled: true, // only fetch if certain conditions are met
            // retry: false, // disable retrying failed requests
        }
    );
};