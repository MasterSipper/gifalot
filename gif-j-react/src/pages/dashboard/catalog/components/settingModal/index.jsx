import React from "react";
import { InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { SetFolder } from "../../../../../store/slices/foldersSlice";
import { modalSelector } from "../../../store/selector/modalSelector";
import {
  settingsClosed,
  viewModalOpen,
} from "../../../store/modalSlice/modalSlice";
import { SelectsOptions } from "../../../../../static/selectsOptions";

import timer from "../../../assets/icons/timer.png";
import trans from "../../../assets/icons/transition.png";

import "./style.css";

export const SettingModal = () => {
  const dispatch = useDispatch();

  const { folderItem } = useSelector(FoldersSelector);
  const { settings } = useSelector(modalSelector);

  const initialSeconds = folderItem?.timePerSlide / 1000;
  const initialAnimation = folderItem?.transitionType;

  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [animation, setAnimation] = React.useState(initialAnimation);

  const handleInputChange = (value) => {
    setSeconds((prevState) => value);
  };

  const handleAnimation = (value) => {
    setAnimation((prevState) => value);
  };

  const handleViewModalOpen = (e) => {
    e.stopPropagation();
    dispatch(settingsClosed());
    dispatch(viewModalOpen());
  };

  const handleCancel = async () => {
    if (seconds !== initialSeconds || animation !== initialAnimation) {
      await axiosInstance.patch(`${collections}/${folderItem.id}`, {
        timePerSlide: seconds * 1000,
        transitionType: animation,
      });
      const item = {
        ...folderItem,
        timePerSlide: seconds * 1000,
        transitionType: animation,
      };
      dispatch(SetFolder(item));
    }

    dispatch(settingsClosed());
  };
  return (
    <Modal
      centered={true}
      title={"Compilation settings"}
      closable={true}
      keyboard={true}
      open={settings}
      footer={<></>}
      onCancel={handleCancel}
      className={"setting_modal"}
    >
      <div className={"setting_modal__box"}>
        <img src={timer} alt={timer} />
        <p>Duration per image:</p>
        <InputNumber
          defaultValue={seconds}
          className={"box__input"}
          onChange={handleInputChange}
          max={15}
          min={2}
        />
      </div>

      <div className={"setting_modal__box"}>
        <img src={trans} alt={"transitionIn"} />
        <p>Animation:</p>
        <Select
          defaultValue={initialAnimation}
          className={"box__select"}
          onChange={handleAnimation}
          options={SelectsOptions}
        />
      </div>

      <p>
        Set timing and transition for all items in compilation. You can define
        timing and transitions per item in the
        <span
          className={"span"}
          title={"you can change items view at settings section"}
          onClick={handleViewModalOpen}
        >
          list view
        </span>
      </p>
    </Modal>
  );
};
