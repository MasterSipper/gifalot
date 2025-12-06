import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { routes } from "../../static/routes";
import { RehydrateAuth } from "../../store/slices/userSlice";

export const RememberMe = ({ children }) => {
  const { rememberMe, isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Rehydrate auth on mount to ensure state is current
  React.useEffect(() => {
    dispatch(RehydrateAuth());
  }, [dispatch]);

  // If user is authenticated, redirect to dashboard (don't show login page)
  // Note: rememberMe can be false, but if isAuth is true, user should go to dashboard
  if (isAuth) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return children;
};
