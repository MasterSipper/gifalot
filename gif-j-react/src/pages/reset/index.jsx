import React from "react";
import { ResetForm } from "./components";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { routes } from "../../static/routes";

import "./style.css";

export const ResetPage = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate(routes.login);
  };
  return (
    <div className={"reset__page__wrapper"}>
      <Button type={"default"} className={"back_btn"} onClick={toLogin}>
        <LeftOutlined /> go back
      </Button>

      <ResetForm />
    </div>
  );
};
