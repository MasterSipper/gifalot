import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { routes } from "../../static/routes";

// TODO: Re-enable authentication when ready
// Set DISABLE_AUTH to false to re-enable login redirects
const DISABLE_AUTH = true;

export const RememberMe = ({ children }) => {
  const { rememberMe, isAuth } = useSelector((state) => state.user);

  React.useEffect(() => {}, [rememberMe]);

  // Temporarily bypass authentication redirect
  if (DISABLE_AUTH) {
    return children;
  }

  if (rememberMe !== "false" && isAuth)
    return <Navigate to={routes.dashboard} />;

  return children;
};
