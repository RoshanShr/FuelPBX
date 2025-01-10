import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import { CiLogout } from "react-icons/ci";

const CommonWrapper = ({ children }) => {
  const navigate = useNavigate();
  const loggedData = useContext(UserContext);

  function logout() {
    localStorage.removeItem("hostedpbx");
    loggedData.setLoggedUser(null);
    navigate("/login");
  }

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header Section */}
        <div
          className="d-flex bg-light p-2 border-bottom shadow-sm  w-100"
          style={{ zIndex: 1 }}
        >
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column">
              <span className="fw-bold">{loggedData.loggedUser.fullname}</span>
              <small className="text-muted">
                {loggedData.loggedUser.email}
              </small>
            </div>
            <button
              title="Logout"
              className="btn btn-sm btn-outline-danger me-3"
              style={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={logout}
            >
              <CiLogout size={24} className="icon-spacing" />
              Logout
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-grow-1 overflow-hidden mt-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CommonWrapper;
