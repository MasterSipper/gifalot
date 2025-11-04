import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

import "./style.css";

export const ErrorPage = () => {
  return (
    <div className={"error__page__wrapper"}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link to="dashboard">
        <Button type="primary">Back dashboard</Button>
      </Link>
    </div>
  );
};
