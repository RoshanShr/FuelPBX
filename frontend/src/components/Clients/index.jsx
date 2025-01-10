import { UserContext } from "../../contexts/UserContext";
import { useState, useContext } from "react";
import { useFormik } from "formik";
import { clientSchema } from "../../schemas/clientSchema";
import { useDeleteClient } from "../../api/clients/deleteClientsApi";
import { useGetClients } from "../../api/clients/getClientsApi";
import { useAddClient } from "../../api/clients/addClientsApi";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Pagination from "../../common/Pagination"; // Import the pagination component
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";

const initialValues = {
  name: "",
  alias: "",
  user_limit: "",
  extension_limit: "",
};

const Clients = () => {
  const loggedData = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const togglePopup = () => setShowForm(!showForm);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); // Default 10 items per page
  const navigate = useNavigate();

  const {
    data: clientsData,
    isLoading,
    isError,
    error,
  } = useGetClients(loggedData, currentPage, itemsPerPage);
  const addClientMutation = useAddClient(loggedData);
  const deleteClientMutation = useDeleteClient(loggedData);
  // Pagination state

  const clients = clientsData?.data || [];
  const totalItems = clientsData?.totalItems || 0;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: clientSchema(clients),
    onSubmit: (values, action) => {
      submitData(values);
      action.resetForm();
      setShowForm(false);
    },
  });

  // Handle change in items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage); // Update the number of items per page
    setCurrentPage(1); // Reset to the first page when the number of items per page changes
  };

  function submitData(clientData) {
    addClientMutation.mutate(clientData);
  }

  function deleteConfirmation(id) {
    confirmAlert({
      title: "Confirm to delete",
      message: (
        <>
          Are you sure to delete? <br />
          Users and extensions of this client will also be deleted.
        </>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
          // onClick: () => alert('Click No')
        },
      ],
    });
  }

  function handleDelete(id) {
    deleteClientMutation.mutate(id);
  }

  const detailPage = (client) => {
    navigate(`/clients/detail`, { state: { client } });
  };

  return (
    <div className="flex-grow-1 h-100 p-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Clients
          </li>
        </ol>
      </nav>

      {loggedData.loggedUser.isAdmin === 1 && (
        <div className="d-flex justify-content-end">
          <button
            title="Add Client"
            className="btn btn-primary"
            onClick={togglePopup}
          >
            <IoMdPersonAdd />
          </button>
        </div>
      )}

      <div className="d-flex" style={{ height: "calc(100% - 140px)" }}>
        <div className="overflow-auto flex-grow-1">
          <table className="table table-hover overflow-auto">
            <thead>
              <tr>
                <th>Client</th>
                <th>Alias</th>
                <th>User(s) limit</th>
                <th>Extension(s) limit</th>
                {loggedData.loggedUser.isAdmin === 1 && <th>Action</th>}
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
                  <tr
                    key={client.id}
                    onClick={() => detailPage(client)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{client.name}</td>
                    <td>{client.alias}</td>
                    <td>{client.user_limit}</td>
                    <td>{client.extension_limit}</td>
                    {loggedData.loggedUser.isAdmin === 1 && (
                      <td>
                        <span
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={
                            client.name === "Voxcrow"
                              ? "You cannot delete Voxcrow"
                              : "Delete this client"
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when delete button is clicked
                            client.name === "Voxcrow"
                              ? ""
                              : deleteConfirmation(client.id);
                          }}
                        >
                          <button
                            disabled={client.name === "Voxcrow"}
                            className="btn btn-sm btn-danger"
                          >
                            <FaTrash />
                          </button>
                        </span>
                      </td>
                    )}
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

      {/* Pagination Component */}
      {!isLoading && !isError && (
        <div>
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange} // Pass the function to handle per page change
          />
        </div>
      )}
      {showForm && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Client</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={togglePopup}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3 row">
                    <label htmlFor="alias" className="col-sm-3 col-form-label">
                      Name
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                      />
                      {formik.errors.name && formik.touched.name ? (
                        <p className="form-error">{formik.errors.name}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="alias" className="col-sm-3 col-form-label">
                      Alias
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="alias"
                        name="alias"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.alias}
                      />
                      {formik.errors.alias && formik.touched.alias ? (
                        <p className="form-error">{formik.errors.alias}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="alias" className="col-sm-3 col-form-label">
                      User(s) limit
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="user_limit"
                        name="user_limit"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.user_limit}
                      />
                      {formik.errors.user_limit && formik.touched.user_limit ? (
                        <p className="form-error">{formik.errors.user_limit}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label htmlFor="alias" className="col-sm-3 col-form-label">
                      Extension(s) limit
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="extension_limit"
                        name="extension_limit"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.extension_limit}
                      />
                      {formik.errors.extension_limit &&
                      formik.touched.extension_limit ? (
                        <p className="form-error">
                          {formik.errors.extension_limit}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={togglePopup}
                    >
                      Discard
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
