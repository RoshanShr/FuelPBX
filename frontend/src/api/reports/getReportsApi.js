import axios from "axios";
import {
    useQuery
} from "react-query";


const apiUrl =
    import.meta.env.VITE_API_URL;

const clientApi = axios.create({
    baseURL: apiUrl
});

export const getReports = async (loggedData, page, limit) => {
    const response = await clientApi.get(`/reports?page=${page}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${loggedData.loggedUser.token}`
        }
    });
    return response.data;
}


export const useGetReports = (loggedData, currentPage, itemsPerPage) => {
    return useQuery(
        ["reports", currentPage,  itemsPerPage], // Query key includes currentPage for dynamic fetching
        () => getReports(loggedData, currentPage, itemsPerPage),
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