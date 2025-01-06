import axios from "axios";

const apiUrl =
    import.meta.env.VITE_API_URL;

const clientApi = axios.create({
    baseURL: apiUrl
});


export const updateClient = async (client) => {
    return await clientApi.post(`/clients/${client.id}`, client);
}



