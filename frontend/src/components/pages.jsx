import AuthHandler from "../core/AuthHandler";
import AuthFlowWrapper from "../templates/Authflow";
import CommonWrapper from "../templates/CommonFlow";
import Login from "./Login";
import Register from "./Register";
import Clients from "./Clients";
import ClientDetails from "./Clients/Details"; // Import the ClientDetails component
import Reports from "./Reports/Reports";
import InvalidPage from "./PageNotFound/InvalidPage";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

// Role-based Route Guard
const AdminRoute = ({ element }) => {
  const loggedData = useContext(UserContext);
  const userRole = loggedData.loggedUser.isAdmin;
  return userRole === 1 ? element : <Navigate to="/invalid" />;
};

export const pages = [
  {
    path: "",
    element: <AuthHandler />,
    children: [
      {
        path: "",
        element: <AuthFlowWrapper />,
        children: [
          {
            path: "",
            element: <Login />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      {
        path: "clients",
        element: <CommonWrapper />,
        children: [
          {
            path: "",
            element: <AdminRoute element={<Clients />} />,
          },
          {
            path: "detail", // Dynamic route for client details
            element: <AdminRoute element={<ClientDetails />} />,
          },
        ],
      },
      {
        path: "reports",
        element: <CommonWrapper />,
        children: [
          {
            path: "",
            element: <Reports />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <CommonWrapper />,
        children: [
          {
            path: "",
            element: <ClientDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "*", // Catch-all route for invalid paths
    element: <InvalidPage />, // Directly render InvalidPage
  },
];
