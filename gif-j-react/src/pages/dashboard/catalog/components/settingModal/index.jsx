import React from "react";
import { InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections, file } from "../../../../../static/api";
import { SetFolder, setImages } from "../../../../../store/slices/foldersSlice";
import { modalSelector } from "../../../store/selector/modalSelector";
import {
  settingsClosed,
  viewModalOpen,
} from "../../../store/modalSlice/modalSlice";
import { SelectsOptions, templateSelectOptions } from "../../../../../static/selectsOptions";

import timer from "../../../assets/icons/timer.png";
import trans from "../../../assets/icons/transition.png";

import "./style.css";

export const SettingModal = () => {
  const dispatch = useDispatch();

  const { folderItem, folderImages } = useSelector(FoldersSelector);
  const { settings } = useSelector(modalSelector);

  const initialSeconds = folderItem?.timePerSlide / 1000;
  const initialAnimation = folderItem?.transitionType;
  const initialTemplate = folderItem?.template || "1up";

  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [animation, setAnimation] = React.useState(initialAnimation);
  const [template, setTemplate] = React.useState(initialTemplate);

  React.useEffect(() => {
    setSeconds(folderItem?.timePerSlide / 1000);
    setAnimation(folderItem?.transitionType);
    setTemplate(folderItem?.template || "1up");
  }, [folderItem]);

  const handleInputChange = (value) => {
    setSeconds((prevState) => value);
  };

  const handleAnimation = (value) => {
    setAnimation((prevState) => value);
  };

  const handleTemplate = (value) => {
    setTemplate((prevState) => value);
  };

  const handleViewModalOpen = (e) => {
    e.stopPropagation();
    dispatch(settingsClosed());
    dispatch(viewModalOpen());
  };

  const handleCancel = async () => {
    if (seconds !== initialSeconds || animation !== initialAnimation || template !== initialTemplate) {
      // Update collection settings (timePerSlide and transitionType)
      await axiosInstance.patch(`${collections}/${folderItem.id}`, {
        timePerSlide: seconds * 1000,
        transitionType: animation,
      });
      
      // Update template for all files in the collection
      if (template !== initialTemplate && folderImages && folderImages.length > 0) {
        // Update all files with the new template
        const updatePromises = folderImages.map((fileItem) =>
          axiosInstance.patch(`${file}/${fileItem.id}`, {
            template: template,
          })
        );
        
        await Promise.all(updatePromises);
        
        // Update local state
        const updatedImages = folderImages.map((item) => ({
          ...item,
          template: template,
        }));
        dispatch(setImages(updatedImages));
      }
      
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
          value={seconds}
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
          value={animation}
          className={"box__select"}
          onChange={handleAnimation}
          options={SelectsOptions}
        />
      </div>

      <div className={"setting_modal__box"}>
        <img src={trans} alt={"template"} />
        <p>Template:</p>
        <Select
          value={template}
          className={"box__select"}
          onChange={handleTemplate}
          options={templateSelectOptions}
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
