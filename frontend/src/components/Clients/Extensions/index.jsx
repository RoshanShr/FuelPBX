import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { extensionSchema } from "../../../schemas/extensionSchema";
import { ToastContainer } from "react-toastify";
import Pagination from "../../../common/Pagination"; // Import the pagination component
import { confirmAlert } from "react-confirm-alert"; // Import

import { UserContext } from "../../../contexts/UserContext";
import { useState, useContext } from "react";
import { useAddExtension } from "../../../api/extensions/addExtensionApi";
import { useGetExtensions } from "../../../api/extensions/getExtensionApi";
import { useDeleteExtension } from "../../../api/extensions/deleteExtensionApi";
import { useUpdateExtension } from "../../../api/extensions/updateExtensionApi";
import ExtensionAddForm from "../Extensions/addForm";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import moment from 'moment';

function Extensions(organization) {
  let { id, name } = organization.props;

  const loggedData = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [editExtension, setEditExtension] = useState(null);

  const {
    data: extensionsData,
    isLoading,
    isError,
    error,
  } = useGetExtensions(id, loggedData, currentPage, itemsPerPage);

  const extensions = extensionsData?.data || [];
  const totalItems = extensionsData?.totalItems || 0;

  const addExtensionMutation = useAddExtension(loggedData);
  const deleteExtnesionMutation = useDeleteExtension(loggedData);
  const updateExtensionMutation = useUpdateExtension(loggedData);

  const handleAddExtension = (extensionsData) => {
    addExtensionMutation.mutate(extensionsData);
    setShowPopup(false);
  };

  const handleEditExtension = (extensionsData) => {
    updateExtensionMutation.mutate(extensionsData);
    setShowPopup(false);
  };

  const handleEditButtonClick = (user) => {
    setEditExtension(user);
    setShowPopup(true);
  };

  function deleteConfirmation(id) {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do delete?",
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
    deleteExtnesionMutation.mutate(id);
  }

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setEditExtension(null);
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage); // Update the number of items per page
    setCurrentPage(1); // Reset to the first page when the number of items per page changes
  };

  return (
    <div>
      <div style={{flex: 1}}>
        <ToastContainer />
        <button
          title="Add extension"
          style={{ float: "right" }}
          className="btn btn-primary"
          onClick={togglePopup}
        >
          <IoMdPersonAdd />
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Agent</th>
              <th>Extension</th>
              <th>Status</th>
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
            ) : extensions.length > 0 ? (
              extensions.map((extension) => (
                <tr key={extension.id}>
                  <td>{extension.agent}</td>
                  <td>{extension.agent}</td>
                  <td>{extension.extension}</td>
                  <td>{moment(extension.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</td>
                  <td>
                    <button
                      title="Edit extension"
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditButtonClick(extension)}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      title="Delete extension"
                      onClick={() => {
                        deleteConfirmation(extension.id);
                      }}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No extensions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      {!isLoading && !isError && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
      )}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Extension</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={togglePopup}
                ></button>
              </div>
              <div className="modal-body">
                <ExtensionAddForm
                  initialValues={
                    editExtension || {
                      organization_id: id,
                      agent: "",
                      extension: "",
                      password: "",
                      confirm_password: "",
                    }
                  }
                  validationSchema={extensionSchema(
                    extensions,
                    editExtension ? editExtension.id : null
                  )}
                  onSubmit={
                    editExtension ? handleEditExtension : handleAddExtension
                  }
                  onCancel={togglePopup}
                  isEdit={!!editExtension}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Extensions;
