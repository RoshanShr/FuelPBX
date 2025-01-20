import apiClient from "../../utils/apiClient";


export const updateClient = async (client) => {
    return await apiClient.post(`/clients/${client.id}`, client);
}



