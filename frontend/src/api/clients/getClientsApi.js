import axios from "axios";
import {
    useQuery

} from "react-query";


const apiUrl =
    import.meta.env.VITE_API_URL;

const clientApi = axios.create({
    baseURL: apiUrl
});

export const getClient = async (loggedData,page, limit) => {
    const response = await clientApi.get(`/clients?organization_id=${loggedData.loggedUser.organization_id}&isAdmin=${loggedData.loggedUser.isAdmin}&page=${page}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${loggedData.loggedUser.token}`
        }
    });
    return response.data;
}

// React Query Hooks

// export const useGetClients = (loggedData) => {
//     return useQuery(["clients"], () => getClient(loggedData), {
//         onError: (error) => {
//             toast.error(`Failed to fetch clients: ${error.message}`);
//         },
//     });
// };



export const useGetClients = (loggedData, currentPage, itemsPerPage) => {
    return useQuery(
        ["clients", currentPage,  itemsPerPage], // Query key includes currentPage for dynamic fetching
        () => getClient(loggedData, currentPage, itemsPerPage),
        {
          //  staleTime: 300000,  // Set staleTime to 5 minutes (in ms)
          //  cacheTime: 600000,  // Set cacheTime to 10 minutes (in ms)
           // refetchOnWindowFocus: false, // Optional: Prevent refetching when window is focused
            onError: (error) => {
                console.error('Error fetching clients:', error);
            },
            // Optionally, you can add other settings, like:
            // enabled: true, // only fetch if certain conditions are met
            // retry: false, // disable retrying failed requests
        }
    );
};