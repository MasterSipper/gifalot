import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router";
import { routes } from "../../../../static/routes";

import "./style.css";

export const PrivateErrorModal = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    // Store the current URL to redirect back after registration
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate(routes.reg);
  };

  const handleCancel = () => {
    navigate(routes.login);
  };

  return (
    <Modal
      centered={true}
      title={"Error"}
      closable={true}
      keyboard={true}
      width={"589px"}
      open={true}
      onCancel={handleCancel}
      className={"player_modal__error"}
      footer={<></>}
    >
      <div className={"error__block"}>
        <p>
          This compilation is private. Please create an account to create your own compilations.
        </p>
        <Button
          type={"primary"}
          onClick={handleCreateAccount}
          style={{ marginTop: 16, width: "100%" }}
        >
          Create user
        </Button>
      </div>
    </Modal>
  );
};




