import React from "react";
import { LoginForm } from "./loginForm";

import login from "../../assets/images/login.jpg";

import "./style.css";

export const LoginPage = () => {
  return (
    <div className={"login__page__wrapper"}>
      <img src={login} alt={"login"} />
      <LoginForm />
    </div>
  );
};
