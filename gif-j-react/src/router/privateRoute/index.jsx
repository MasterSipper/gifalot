import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable login checks
const DISABLE_AUTH = true;

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);

  React.useEffect(() => {}, [isAuth]);

  // Temporarily bypass authentication check
  if (DISABLE_AUTH) {
    return children;
  }

  return isAuth ? children : <Navigate to="/" />;
};
