import {
    useMutation,
    useQueryClient
} from "react-query";

import {
    toast
} from 'react-toastify';

import {
    UserContext
} from "../../contexts/UserContext";
import {
    useContext
} from "react";
import {
    useNavigate
} from "react-router-dom"
import apiClient from "../../utils/apiClient";

const jwtSecretKey = import.meta.env.VITE_JWT_SECRET_KEY;
const notify = (type, msg) => toast[type](msg);

export const login = async (data) => {
    const response = await apiClient.post("/login", data.data);
    return response;

};

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const loggedData = useContext(UserContext);

    return useMutation(
        async (data) => {
            const response = await login({
                data
            });
            return response;

        }, {
            onSuccess: (response) => {
                if (response.data.accessToken != undefined) {
                    localStorage.setItem(jwtSecretKey, JSON.stringify(response.data));
                    localStorage.setItem("accessToken", response.data.accessToken); 
                    localStorage.setItem("refreshToken", response.data.refreshToken); 
                    loggedData.setLoggedUser(response.data);
                    navigate("/dashboard")
                }
                queryClient.invalidateQueries("users");
            },
            onError: (error) => {
                if(error.status==403 || error.status==404){
                    notify("error", `Wrong username or password!`);
                }else{
                    notify("error", `Error while login: ${error.message}`);
                }   
            },
        }
    );
};