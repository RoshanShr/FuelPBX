import {
    useMutation
} from '@tanstack/react-query';
import apiClient from "../../utils/apiClient";

import {
    toast
} from 'react-toastify';

const notify = (type, msg) => toast[type](msg);


// export const addClient = async (
//     data
// ) => {
//     await apiClient.post("/clients", data.clientData);
//     // await apiClient.post("/clients", data.clientData, {
//     //     headers: {
//     //         "Authorization": `Bearer ${data.loggedData.loggedUser.accessToken}`
//     //     }
//     // });

// }


export const useAddClient = () => {
    return useMutation({
        queryKey: ["clients"], // Query key with dynamic parameters
        mutationFn: async (clientData) => {
            await apiClient.post("/clients", clientData);
        },
        onSuccess: () => {
            notify("success", "Client added successfully")
        },
        onError: (error) => {
            notify("error", `Error while adding client:${error.message}`)
        },
        enabled: !!localStorage.getItem('accessToken'), // Conditional fetching (optional)
        // retry: false, // Disable retrying failed requests
    });
};

// export const useAddClient = (loggedData) => {
//     const queryClient = useQueryClient();
//     return useMutation((clientData) => addClient({
//         loggedData,
//         clientData
//     }), {
//         onSuccess: () => {
//             queryClient.invalidateQueries("clients");
//             notify("success", "Client added successfully")
//         },
//         onError: (error) => {
//             notify("error", `Error while adding client:${error.message}`)
//         },
//     });
// };