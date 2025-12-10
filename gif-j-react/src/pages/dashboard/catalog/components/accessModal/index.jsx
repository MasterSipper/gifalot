import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector, UserInfo } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { SetFolder } from "../../../../../store/slices/foldersSlice";
import { modalSelector } from "../../../store/selector/modalSelector";
import { accessClosed } from "../../../store/modalSlice/modalSlice";
import { Button, Input, Modal, notification } from "antd";
import { QRCodeSVG } from "qrcode.react";

import "./style.css";

export const AccessModal = () => {
  const dispatch = useDispatch();

  const { access } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);

  React.useEffect(() => {}, [folderItem, folderItem.private]);
  const textRef = React.useRef();

  // Get the public URL for sharing
  const getPublicUrl = () => {
    // Use public URL from env if set, otherwise use current origin
    // This ensures sharing links work on the current domain (dev.gifalot.com)
    const publicUrl = process.env.REACT_APP_PUBLIC_URL || window.location.origin;
    return `${publicUrl}/#/${userInfo.id}/${folderItem.id}/carousel`;
  };

  const shareUrl = getPublicUrl();

  const handleCopyLink = async (e) => {
    e.preventDefault();
    if (folderItem.private) {
      notification.info({
        message: "Only the public folder can be shown",
      });
    }
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        notification.success({
          message: "Link copied to clipboard",
        });
      } else {
        // Fallback to old method
        textRef.current.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        notification.success({
          message: "Link copied to clipboard",
        });
      }
    } catch (e) {
      console.error("Failed to copy link:", e);
      notification.error({
        message: "Failed to copy link",
        description: "Please copy the link manually",
      });
    }
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
        <div>
          <p>Compilation link: </p>{" "}
          <Input
            ref={textRef}
            value={shareUrl}
            style={{ width: "254px" }}
          />{" "}
          <Button type={"primary"} onClick={handleCopyLink}>
            Copy
          </Button>
        </div>
        
        {/* QR Code for sharing */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <p style={{ marginBottom: "10px", fontSize: "14px", color: "#636E72" }}>Scan to open on mobile:</p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            padding: "15px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #DFE6E9"
          }}>
            <QRCodeSVG
              value={shareUrl}
              size={100}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
