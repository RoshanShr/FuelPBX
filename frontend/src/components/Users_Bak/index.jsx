import { UserContext } from "../../contexts/UserContext";
import { useState, useContext } from "react";
import { useGetUsers } from "../../api/users/getUsersApi";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Pagination from "../../common/Pagination"; // Import the pagination component

// const initialValues = {
//   name: "",
//   alias: "",
// };

const Users = () => {
  const loggedData = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useGetUsers(loggedData, currentPage, itemsPerPage);
  //   const addClientMutation = useAddClient(loggedData);
  // Pagination state

  const users = usersData?.data || [];
  const totalItems = usersData?.totalItems || 0;
  //   const formik = useFormik({
  //     initialValues: initialValues,
  //     validationSchema: clientSchema(clients),
  //     onSubmit: (values, action) => {
  //       submitData(values);
  //       action.resetForm();
  //       setShowForm(false);
  //     },
  //   });

  // Extract data and pagination metadata from the backend response

  // Handle change in items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage); // Update the number of items per page
    setCurrentPage(1); // Reset to the first page when the number of items per page changes
  };

  //   function submitData(clientData) {
  //     addClientMutation.mutate(clientData);
  //   }

  //   function deleteConfirmation(id) {
  //     confirmAlert({
  //       title: "Confirm to delete",
  //       message: "Are you sure to do delete?",
  //       buttons: [
  //         {
  //           label: "Yes",
  //           onClick: () => handleDelete(id),
  //         },
  //         {
  //           label: "No",
  //           // onClick: () => alert('Click No')
  //         },
  //       ],
  //     });
  //   }

  //   function handleDelete(id) {
  //     deleteClientMutation.mutate(id);
  //   }
  return (
    <div className="flex-grow-1 p-4">
      <h2>Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
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
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button title="Delete" className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users available</td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default Users;
