import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { registerSchema } from "../../../schemas/registerSchema";
import { useAddUser } from "../../../api/users/addUserApi";
import Pagination from "../../../common/Pagination"; // Import the pagination component
import { confirmAlert } from "react-confirm-alert"; // Import

import { UserContext } from "../../../contexts/UserContext";
import { useState, useContext } from "react";
import { useGetUsers } from "../../../api/users/getUsersApi";
import { useDeleteUser } from "../../../api/users/deleteUserApi";
import { useUpdateUser } from "../../../api/users/updateUserApi";
import UserAddForm from "../Users/addForm";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import moment from "moment";

function Users(organization) {
  const { id, name, alias } = organization.props;
  const loggedData = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showPopup, setShowPopup] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useGetUsers(id, loggedData, currentPage, itemsPerPage);

  const addUserMutation = useAddUser(loggedData);
  const deleteUserMutation = useDeleteUser(loggedData);
  const updateUserMutation = useUpdateUser(loggedData);

  const users = usersData?.data || [];
  const totalItems = usersData?.totalItems || 0;

  const togglePopup = () => {
    setEditUser(null);
    setShowPopup(!showPopup);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddUser = (userData) => {
    addUserMutation.mutate(userData);
    setShowPopup(false);
  };

  const handleEditUser = (userData) => {
    updateUserMutation.mutate(userData);
    setShowPopup(false);
  };

  const handleEditButtonClick = (user) => {
    user["organization_alias"] = alias;
    user["password"] = "";

    setEditUser(user);
    setShowPopup(true);
  };

  const handleDelete = (id) => {
    deleteUserMutation.mutate(id);
  };

  const deleteConfirmation = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          title="Add user"
          className="btn btn-primary"
          onClick={togglePopup}
        >
          <IoMdPersonAdd />
        </button>
      </div>

      <div className="d-flex" style={{ height: "calc(100% - 172px)" }}>
        <div className="overflow-auto flex-grow-1">
          <table className="table overflow-auto">
            <thead>
              <tr>
                <th>Fullname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created at</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="5">Error: {error.message}</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullname}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {moment(user.start_time).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>
                      <button
                        title="Edit user"
                        className="btn btn-sm btn-info"
                        onClick={() => handleEditButtonClick(user)}
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        title="Delete user"
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteConfirmation(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No users available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      {showPopup && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editUser ? "Edit User" : "Add User"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={togglePopup}
                ></button>
              </div>
              <div className="modal-body">
                <UserAddForm
                  initialValues={
                    editUser || {
                      organization_id: id,
                      organization_alias: alias,
                      fullname: "",
                      username: "",
                      email: "",
                      password: "",
                      confirm_password: "",
                    }
                  }
                  validationSchema={registerSchema(
                    users,
                    alias,
                    editUser ? editUser.id : null
                  )}
                  onSubmit={editUser ? handleEditUser : handleAddUser}
                  onCancel={togglePopup}
                  isEdit={!!editUser}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
