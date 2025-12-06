import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { routes } from "../../static/routes";
import { RehydrateAuth } from "../../store/slices/userSlice";
import { TokenService } from "../../helpers/tokenService";
import { userService } from "../../helpers/userService";

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = React.useState(true);
  const [authFromStorage, setAuthFromStorage] = React.useState(false);

  // Rehydrate auth state from storage on mount and check directly
  React.useEffect(() => {
    // Check storage directly first (most reliable source of truth)
    const checkAuth = () => {
      const user = userService.getUser();
      const accessToken = TokenService.getAccessToken();
      const authenticated = Boolean(user && accessToken);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("PrivateRoute - Auth check:", {
          hasUser: !!user,
          hasToken: !!accessToken,
          authenticated,
          isAuth,
          user: user,
          token: accessToken ? 'present' : 'missing'
        });
      }
      
      return authenticated;
    };
    
    // Rehydrate Redux state
    dispatch(RehydrateAuth());
    
    // Check storage and set state
    const authenticated = checkAuth();
    setAuthFromStorage(authenticated);
    
    // Small delay to ensure Redux state has updated
    setTimeout(() => {
      setIsChecking(false);
    }, 50);
  }, [dispatch, isAuth]);

  // Update when Redux state changes (in case it updates after rehydration)
  React.useEffect(() => {
    if (isAuth && !authFromStorage) {
      setAuthFromStorage(true);
    }
  }, [isAuth, authFromStorage]);

  // Wait for initial check to complete
  if (isChecking) {
    return null; // or a loading spinner
  }

  // Check authentication state - use storage check as primary, Redux as fallback
  const finalAuthState = authFromStorage || isAuth;
  
  if (process.env.NODE_ENV === 'development') {
    console.log("PrivateRoute - Final auth decision:", {
      finalAuthState,
      authFromStorage,
      isAuth
    });
  }
  
  if (!finalAuthState) {
    if (process.env.NODE_ENV === 'development') {
      console.log("PrivateRoute - Not authenticated, redirecting to login");
    }
    return <Navigate to={routes.login} replace />;
  }

  return children;
};
