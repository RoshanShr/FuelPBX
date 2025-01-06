import Sidebar from "../components/Sidebar";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { ToastContainer } from 'react-toastify';
import { useGetClients, useAddClient, useDeleteClient } from "../api/clientApi";

const Clients = () => {

    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    // const [clients, setClients] = useState({});
    const [clientData, setClientData] = useState({
        name: "",
        alias: ""
    })

    const { data: clients, isLoading, isError, error } = useGetClients(loggedData);
    const addClientMutation = useAddClient(loggedData);
    const deleteClientMutation = useDeleteClient(loggedData);

    function logout() {
        localStorage.removeItem("hostedpbx");
        loggedData.setLoggedUser(null);
        navigate("/login");
    }

    // useEffect(() => {
    //     getClients();
    // }, [])



    function handleInput(event) {
        setClientData((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value }
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        addClientMutation.mutate(clientData)
    }

    function handleDelete(id) {
        deleteClientMutation.mutate(id)
    }
    return (
        <div className="d-flex">
            <Sidebar />
            <ToastContainer />
            <div className="flex-grow-1 p-4">
                <div>
                    {/* Button to toggle form */}
                    <button
                        className="btn btn-primary mb-4"
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        {showForm ? "Close Form" : "Add Client"}
                    </button>
                </div>

                <div>
                    <button className="btn btn-danger mb-4" onClick={logout}>Logout</button>
                </div>

                {/* Add Client Form */}
                {showForm && (
                    <form className="mb-4" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name" onChange={handleInput}
                                name="name" value={clientData.name}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Alias</label>
                            <input
                                type="text"
                                id="text" onChange={handleInput}
                                name="alias" value={clientData.alias}
                                className="form-control"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success">Submit</button>
                    </form>
                )}


                <h2>Clients</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Alias</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="3">Loading...</td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan="3">Error: {error.message}</td>
                            </tr>
                        ) : clients.length > 0 ? (
                            clients.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.name}</td>
                                    <td>{client.alias}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(client.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No clients available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;