import React from "react";
import { Modal, Select } from "antd";
import { viewSelectOptions } from "../../../../../static/selectsOptions";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import { modalSelector } from "../../../store/selector/modalSelector";
import { viewModalClosed } from "../../../store/modalSlice/modalSlice";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { SetFolder } from "../../../../../store/slices/foldersSlice";

export const ViewModal = () => {
  const dispatch = useDispatch();
  const { folderItem } = useSelector(FoldersSelector);
  const { view } = useSelector(modalSelector);
  const [viewValue, setViewValue] = React.useState("grid");

  React.useEffect(() => {
    setViewValue(folderItem.view);
  }, [folderItem.view]);

  const handleViewChange = (value) => {
    setViewValue((prevState) => value);
  };

  const handleCancel = async () => {
    await axiosInstance.patch(`${collections}/${folderItem.id}`, {
      view: viewValue,
    });
    const item = {
      ...folderItem,
      view: viewValue,
    };
    dispatch(SetFolder(item));
    dispatch(viewModalClosed());
  };

  return (
    <Modal
      centered={true}
      title={"Compilation view settings"}
      closable={true}
      keyboard={true}
      open={view}
      footer={<></>}
      onCancel={handleCancel}
      className={"setting_modal"}
    >
      <div className={"setting_modal__box"}>
        <p>Choose your compilation view:</p>
        <Select
          defaultValue={viewValue}
          className={"box__select"}
          onChange={handleViewChange}
          options={viewSelectOptions}
        />
      </div>
    </Modal>
  );
};
