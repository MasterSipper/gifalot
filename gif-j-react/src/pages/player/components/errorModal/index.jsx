import React from "react";
import { Modal } from "antd";

import "./style.css";

export const ErrorModal = () => {
  const handleCancel = () => {
    console.log(window.location);
    let win = window.open(`${window.location.origin}`, "_self");
    win.close();
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
      className={"public_carousel_modal__error"}
      footer={<></>}
    >
      <div className={"error__block"}>
        <p>
          Unable to load this compilation. It may not exist or you may not have permission to view it.
        </p>
      </div>
    </Modal>
  );
};

