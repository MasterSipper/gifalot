import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { routes } from "../../static/routes";

export const RememberMe = ({ children }) => {
  const { rememberMe, isAuth } = useSelector((state) => state.user);

  React.useEffect(() => {}, [rememberMe]);

  if (rememberMe !== "false" && isAuth)
    return <Navigate to={routes.dashboard} />;

  return children;
};
