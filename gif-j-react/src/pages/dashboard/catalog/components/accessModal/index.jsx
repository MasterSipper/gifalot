import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector, UserInfo } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { SetFolder } from "../../../../../store/slices/foldersSlice";
import { modalSelector } from "../../../store/selector/modalSelector";
import { accessClosed } from "../../../store/modalSlice/modalSlice";
import { Button, Input, Modal, notification } from "antd";

import "./style.css";

export const AccessModal = () => {
  const dispatch = useDispatch();

  const { access } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);

  React.useEffect(() => {}, [folderItem, folderItem.private]);
  const textRef = React.useRef();

  const handleCopyLink = async (e) => {
    e.preventDefault();
    if (folderItem.private) {
      notification.info({
        message: "Only the public folder can be shown",
      });
    }
    textRef.current.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    // try {
    //   if (window.isSecureContext && navigator.clipboard)
    //     await navigator.clipboard.writeText(
    //       `${window.location.origin}/#/${userInfo.id}/${folderItem.id}/carousel`
    //     );
    // } catch (e) {
    //   console.log(e);
    // }

    notification.success({
      message: "link copied to clipboard",
    });
  };

  const handleCancel = () => {
    dispatch(accessClosed());
  };

  const handleMakePublic = async () => {
    const data = {
      private: !folderItem.private,
    };
    await axiosInstance.patch(`${collections}/${folderItem.id}`, data);
    const item = {
      ...folderItem,
      private: !folderItem.private,
    };
    dispatch(SetFolder(item));
  };

  return (
    <Modal
      centered={true}
      title={"Share compilation"}
      closable={true}
      keyboard={true}
      width={"557px"}
      open={access}
      onCancel={handleCancel}
      className={"modal_access"}
      footer={
        folderItem.private && (
          <div className={"modal_access__main"}>
            <div className={"access__main__block"}>
              <p>This compilation is private.</p>

              <p className={"bottom"}>
                If you want to view this on another device, log in with your
                account on the device or make the compilation public.
              </p>
            </div>
            <Button onClick={handleMakePublic}>Make public </Button>
          </div>
        )
      }
    >
      <div className={"access__main__block__bottom"}>
        <p>Compilation link: </p>{" "}
        <Input
          ref={textRef}
          value={`${window.location.origin}/#/${userInfo.id}/${folderItem.id}/carousel`}
          style={{ width: "254px" }}
        />{" "}
        <Button type={"primary"} onClick={handleCopyLink}>
          Copy
        </Button>
      </div>
    </Modal>
  );
};
