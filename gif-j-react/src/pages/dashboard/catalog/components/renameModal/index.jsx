import React from "react";
import { Input, Modal, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { FoldersSelector } from "../../../../../store/selectors";
import { SetFolder } from "../../../../../store/slices/foldersSlice";
import { modalSelector } from "../../../store/selector/modalSelector";
import { renameClosed } from "../../../store/modalSlice/modalSlice";

import lockImage from "../../../assets/icons/lock.png";
import unlockImage from "../../../assets/icons/unlock.png";

import "./style.css";

export const RenameModal = () => {
  const dispatch = useDispatch();

  const { rename } = useSelector(modalSelector);
  const { folderItem } = useSelector(FoldersSelector);
  const [lock, setLock] = React.useState(true);
  React.useEffect(() => {
    setLock(!folderItem?.private);
  }, [folderItem]);

  const folderRef = React.useRef(null);

  const handleAddFolder = (e) => {
    folderRef.current = e.target.value;
  };

  const handleOk = async () => {
    const data = {
      name: folderRef.current.input.value,
      private: !lock,
    };
    await axiosInstance.patch(`${collections}/${folderItem.id}`, data);
    const item = {
      ...folderItem,
      name: folderRef.current.input.value,
      private: !lock,
      justCreated: false,
    };
    dispatch(SetFolder(item));
    dispatch(renameClosed());
  };

  const handleCancel = () => {
    if (folderItem?.justCreated) {
      const item = {
        ...folderItem,
        justCreated: false,
      };
      dispatch(SetFolder(item));
    }
    dispatch(renameClosed());
  };

  const handleSwitchChange = (checked) => {
    setLock((prevState) => checked);
  };

  return (
    <Modal
      centered={true}
      title={"Name your compilation"}
      closable={true}
      keyboard={true}
      onOk={handleOk}
      okText={folderItem?.justCreated ? "Create" : "Save"}
      okType={"primary"}
      cancelText={"I’ll do it later"}
      open={rename}
      onCancel={handleCancel}
      className={"modal_edit"}
    >
      <Input
        minLength={1}
        maxLength={128}
        className={"modal_edit__input"}
        ref={folderRef}
        defaultValue={folderItem?.name}
        onChange={(e) => handleAddFolder(e)}
      />

      <div className={"modal_edit__box"}>
        {lock ? (
          <>
            <img src={unlockImage} alt="unlock" />
            <p>Your compilation is public.</p>
          </>
        ) : (
          <>
            <img src={lockImage} alt="lock" />
            <p>Your compilation is private.</p>
          </>
        )}
      </div>

      <div className={"modal_edit__box"}>
        <Switch checked={lock} onChange={handleSwitchChange} />
        <p>Make public to show on other devices</p>
      </div>
    </Modal>
  );
};
