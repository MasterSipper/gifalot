import React from "react";
import { InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector, UserInfo } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections, file } from "../../../../../static/api";
import { SetFolder, getFoldersImages } from "../../../../../store/slices/foldersSlice";
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
  const { userInfo } = useSelector(UserInfo);
  const { settings } = useSelector(modalSelector);

  const initialSeconds = folderItem?.timePerSlide / 1000;
  const initialAnimation = folderItem?.transitionType;
  
  // Determine initial template from files - use the most common template, or "1up" as default
  const initialTemplate = React.useMemo(() => {
    if (!folderImages || folderImages.length === 0) {
      return "1up";
    }
    // Count template occurrences
    const templateCounts = {};
    folderImages.forEach((item) => {
      const tpl = item.template || "1up";
      templateCounts[tpl] = (templateCounts[tpl] || 0) + 1;
    });
    // Return the most common template, or "1up" if all are different/null
    const mostCommon = Object.keys(templateCounts).reduce((a, b) =>
      templateCounts[a] > templateCounts[b] ? a : b
    );
    return mostCommon || "1up";
  }, [folderImages]);

  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [animation, setAnimation] = React.useState(initialAnimation);
  const [template, setTemplate] = React.useState(initialTemplate);

  React.useEffect(() => {
    setSeconds(folderItem?.timePerSlide / 1000);
    setAnimation(folderItem?.transitionType);
    setTemplate(initialTemplate);
  }, [folderItem, initialTemplate]);

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
        try {
          // Validate template value before sending
          if (!template || typeof template !== 'string' || template.length === 0) {
            console.error('Invalid template value:', template);
            throw new Error('Invalid template value');
          }
          
          // Update all files with the new template
          const updatePromises = folderImages.map(async (fileItem) => {
            try {
              const response = await axiosInstance.patch(`${file}/${fileItem.id}`, {
                template: template,
              });
              return response;
            } catch (error) {
              console.error(`Error updating file ${fileItem.id}:`, error.response?.data || error.message);
              throw error;
            }
          });
          
          await Promise.all(updatePromises);
          
          // Reload files from backend to ensure we have the latest data
          if (userInfo?.id && folderItem?.id) {
            await dispatch(getFoldersImages({ userId: userInfo.id, id: folderItem.id }));
          }
        } catch (error) {
          console.error('Error updating file templates:', error);
          console.error('Error details:', error.response?.data || error.message);
          // Still close the modal even if there's an error, but log it
        }
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
