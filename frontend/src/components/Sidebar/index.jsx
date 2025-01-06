import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const Sidebar = () => {
    const loggedData = useContext(UserContext);
  
  // Retrieve active link from localStorage or default to "/clients"
  const [activeLink, setActiveLink] = useState(
    localStorage.getItem("activeLink") || "/clients"
  );

  // Update active link in localStorage on change
  const handleActiveLink = (path) => {
    setActiveLink(path);
    localStorage.setItem("activeLink", path);
  };

  useEffect(() => {
    // Ensure activeLink is synced with localStorage on mount
    const storedActiveLink = localStorage.getItem("activeLink");
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }
  }, []);

  return (
    <div
      className="bg-light border-end p-3"
      style={{ width: "250px", height: "100vh" }}
    >
      <h2
        className="text-center text-secondary fw-bold mb-4"
        style={{
          fontSize: "2rem",
          letterSpacing: "1px",
          borderBottom: "2px solid rgb(78 141 255)", // Border below the heading
          paddingBottom: "10px", // Optional: Adds space between the text and the border
        }}
      >
        Fuel PBX
      </h2>
      <div className="d-flex flex-column h-90">
        <ul className="list-unstyled flex-grow-1">
        <li
            className={`mb-3 ${activeLink === "/dashboard" ? "active" : ""}`}
            onClick={() => handleActiveLink("/dashboard")}
          >
            <Link
              to="/dashboard"
              className={`text-decoration-none text-dark d-flex align-items-center py-2 px-3 rounded ${
                activeLink === "/dashboard"
                  ? "active_menu"
                  : "hover-bg"
              }`}
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
          </li>
          {loggedData.loggedUser.isAdmin===1 && (
          <li
            className={`mb-3 ${activeLink === "/clients" ? "active" : ""}`}
            onClick={() => handleActiveLink("/clients")}
          >
            <Link
              to="/clients"
              className={`text-decoration-none text-dark d-flex align-items-center py-2 px-3 rounded ${
                activeLink === "/clients" ? "active_menu" : "hover-bg"
              }`}
            >
              <i className="bi bi-people-fill me-2"></i> Clients
            </Link>
          </li>
          )}
          <li
            className={`mb-3 ${activeLink === "/reports" ? "active" : ""}`}
            onClick={() => handleActiveLink("/reports")}
          >
            <Link
              to="/reports"
              className={`text-decoration-none text-dark d-flex align-items-center py-2 px-3 rounded ${
                activeLink === "/reports" ? "active_menu" : "hover-bg"
              }`}
            >
              <i className="bi bi-bar-chart-fill me-2"></i> Reports
            </Link>
          </li>
       
        </ul>

      </div>
    </div>
  );
};

export default Sidebar;
