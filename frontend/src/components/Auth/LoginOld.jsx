import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const jwtSecretKey = import.meta.env.VITE_JWT_SECRET_KEY;

    const navigate = useNavigate();
    const notify = () => toast.error("Wrong username or password!");

    const loggedData = useContext(UserContext);

    const [userCreds, setUserCreds] = useState({
        username: "",
        password: ""
    })

    function handleInput(event) {
        setUserCreds((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        fetch(apiUrl + "login", {
            method: "POST",
            body: JSON.stringify(userCreds),
            headers: {
                "Content-Type": "application/json"
            }

        }).then((response) => {
            if (response.status != 200) {
                notify();
            }

            return response.json();

        }).then((data) => {
            if (data.token != undefined) {
                localStorage.setItem(jwtSecretKey, JSON.stringify(data));
                loggedData.setLoggedUser(data);
                navigate("/clients")
                notify();
            }

        }).catch((err) => {
            console.log(err)
        })

    }

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow" style={{ width: "300px" }}>
                <h3 className="text-center">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input
                            type="username"
                            id="username" onChange={handleInput}
                            className="form-control" name="username" value={userCreds.username}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password" onChange={handleInput}
                            className="form-control" name="password" value={userCreds.password}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );

}