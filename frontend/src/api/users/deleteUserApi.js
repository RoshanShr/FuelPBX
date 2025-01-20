import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';
import apiClient from "../../utils/apiClient";

const notify = (type, msg) => toast[type](msg);

export const deleteUser = async ({
    id
}) => {
    try {
        const response = await apiClient.delete("/users", {
            data: {
                id: id
            }
        });

        return response;

    } catch (error) {
        return error;
        // if (error.response) {
        //     // Log the status code and additional error details
        //     console.error(`Error Status Code: ${error.response.status}`);
        //     console.error(`Error Response Data:`, error.response.data);
        // } else {
        //     // General errors without a response (e.g., network issues)
        //     console.error("Error:", error.message);
        // }

        // throw error; // Re-throw the error to handle it where the function is called
    }

}

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation((id) => deleteUser({
        id
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            notify("success", "User deleted successfully")
        },
        onError: (error) => {
            notify("error", `Error while deleting user:${error.message}`)
        },
    });
}