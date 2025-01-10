import axios from "axios";
import {
    useQuery

} from "react-query";


const apiUrl =
    import.meta.env.VITE_API_URL;

const usersApi = axios.create({
    baseURL: apiUrl
});

export const getExtensions = async (organization_id, alias,loggedData,page, limit) => {
    const response = await usersApi.get(`/extensions?organization_id=${organization_id}&alias=${alias}&page=${page}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${loggedData.loggedUser.accessToken}`
        }
    });
    return response.data;
}


export const useGetExtensions = (organization_id,alias,loggedData, currentPage, itemsPerPage) => {
    return useQuery(
        ["extensions", organization_id, alias,currentPage,  itemsPerPage], // Query key includes currentPage for dynamic fetching
        () => getExtensions(organization_id,alias, loggedData, currentPage, itemsPerPage),
        {
          //  staleTime: 300000,  // Set staleTime to 5 minutes (in ms)
          //  cacheTime: 600000,  // Set cacheTime to 10 minutes (in ms)
           // refetchOnWindowFocus: false, // Optional: Prevent refetching when window is focused
            onError: (error) => {
                console.error('Error fetching extensions:', error);
            },
            // Optionally, you can add other settings, like:
            // enabled: true, // only fetch if certain conditions are met
            // retry: false, // disable retrying failed requests
        }
    );
};