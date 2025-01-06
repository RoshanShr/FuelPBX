import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Register from "./Register";

const Auth = ({ isRegister = false }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsRegisterMode(!isRegisterMode);
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "300px" }}>
        {isRegisterMode ? (
            <Register />
        ) : (
            <Login />
        )}
        <button className="btn w-100 btn" onClick={toggleForm}>
          {isRegisterMode
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;
