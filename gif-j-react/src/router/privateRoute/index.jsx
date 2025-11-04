import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);

  React.useEffect(() => {}, [isAuth]);

  return isAuth ? children : <Navigate to="/" />;
};
