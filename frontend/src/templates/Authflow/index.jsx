import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthFlowWrapper = () => {
  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
      <h2
    className="text-center text-secondary fw-bold mb-4"
    style={{
      fontSize: "2rem",
      letterSpacing: "1px",
      borderBottom: "2px solid rgb(97 118 151)", // Border below the heading
      paddingBottom: "10px", // Optional: Adds space between the text and the border
    }}
  >
        Fuel PBX
      </h2>
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthFlowWrapper;
