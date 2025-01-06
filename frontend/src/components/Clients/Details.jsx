import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Users from "./Users";
import Extensions from "./Extensions";
import { FaUsers, FaPhone } from "react-icons/fa6";
import { IoMdArrowRoundBack, IoMdPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

function ClientDetails() {
  const location = useLocation();
  // const client = location.state?.client;
    const loggedData = useContext(UserContext);
  
  const [client, setClient] = useState({id:loggedData.loggedUser.organization_id, alias:loggedData.loggedUser.alias, name:loggedData.loggedUser.company});
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const goBack = () => navigate("/clients");

  return (
    <div className="flex-grow-1 p-4">
      <nav
        className="d-flex"
        aria-label="breadcrumb"
      >
         {/* <button
          title="Go back"
          className="btn btn-sm btn-outline-secondary"
          onClick={goBack}
        >
          <IoMdArrowRoundBack />
          Go back
        </button> */}
        <ol className="breadcrumb mb-0">
        {location.pathname!='/dashboard' && (
          <li className="breadcrumb-item"onClick={goBack}>
            <a onClick={goBack}>Clients</a>
          </li>
        )}
        
      
          <li className="breadcrumb-item active" aria-current="page">
          {location.pathname=='/dashboard' ? "Dashboard": client.name}
          </li>
        </ol>
       
      </nav>

      <div className="organization-page">
        <div className="tabs-container">
          <ul className="nav nav-tabs" style={{ marginBottom: "20px" }}>
            <li
              className="nav-item"
              onClick={() => handleTabClick("users")}
              style={{ cursor: "pointer" }}
            >
              <a
                className={
                  activeTab === "users" ? "nav-link active" : "nav-link"
                }
                aria-current="page"
              >
                Users
              </a>
            </li>
            <li
              className="nav-item"
              style={{ cursor: "pointer" }}
              onClick={() => handleTabClick("extensions")}
            >
              <a
                className={
                  activeTab === "extensions" ? "nav-link active" : "nav-link"
                }
                aria-current="page"
              >
                Extensions
              </a>
            </li>
          </ul>

          {/* <div className="tabs">
            <button
              className={activeTab === "users" ? "tab active" : "tab"}
              onClick={() => handleTabClick("users")}
            >
              <FaUsers size={24} className="icon-spacing" />
              Users
            </button>
            <button
              className={activeTab === "extensions" ? "tab active" : "tab"}
              onClick={() => handleTabClick("extensions")}
            >
              <FaPhone size={24} className="icon-spacing" />
              Extensions
            </button>
          </div> */}

          <div>
            {activeTab === "users" && <Users props={client} />}
            {activeTab === "extensions" && <Extensions props={client} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
