import axios from "axios";
import {
    useQuery
} from "react-query";


const apiUrl =
    import.meta.env.VITE_API_URL;

const clientApi = axios.create({
    baseURL: apiUrl
});

import apiClient from "../auth/refreshTokenApi";


export const getReports = async (loggedData, page, limit,  disposition, callType) => {
    const response = await apiClient.get(`/reports?alias=${loggedData.loggedUser.alias}&disposition=${disposition}&callType=${callType}&page=${page}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });
    return response.data;
}


export const useGetReports = (loggedData, currentPage, itemsPerPage, disposition, callType) => {
    return useQuery(
        ["reports", currentPage,  itemsPerPage,disposition, callType], // Query key includes currentPage for dynamic fetching
        () => getReports(loggedData, currentPage, itemsPerPage,  disposition, callType),
        {
          //  staleTime: 300000,  // Set staleTime to 5 minutes (in ms)
          //  cacheTime: 600000,  // Set cacheTime to 10 minutes (in ms)
           // refetchOnWindowFocus: false, // Optional: Prevent refetching when window is focused
            onError: (error) => {
                console.error('Error fetching reports:', error);
            },
            // Optionally, you can add other settings, like:
            // enabled: true, // only fetch if certain conditions are met
            // retry: false, // disable retrying failed requests
        }
    );
};
// export const useGetReports = (loggedData,currentPage, itemsPerPage) => {
//     return useQuery(["reports"], () => getReports(loggedData,currentPage, itemsPerPage), {
//         onError: (error) => {
//         },
//     });
// }