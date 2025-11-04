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
          You try open private users property in carousel.Tell the owner to make
          a public catalog for viewing and then you will be able to see the
          carousel with his GIF
        </p>
      </div>
    </Modal>
  );
};
