import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import PropTypes from "prop-types"; // Import PropTypes

const AuthHandler = ({ component: Component, authRequired }) => {
  const { loggedUser } = useContext(UserContext);

  if (authRequired && !loggedUser) {
    return <Navigate to="/login" />;
  }

  if (!authRequired && loggedUser) {
    return <Navigate to="/dashboard" />;
  }

  return <Component />;
};

// PropTypes validation
AuthHandler.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]).isRequired, // Ensures 'component' is a valid React component
  authRequired: PropTypes.bool.isRequired, // Ensures 'authRequired' is a boolean
};

export default AuthHandler;