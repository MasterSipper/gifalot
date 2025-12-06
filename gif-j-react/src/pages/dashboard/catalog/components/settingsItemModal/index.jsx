import React from "react";
import timer from "../../../assets/icons/timer.png";
import { InputNumber, Modal, Select } from "antd";
import trans from "../../../assets/icons/transition.png";
import { SelectsOptions, filterSelectOptions } from "../../../../../static/selectsOptions";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector } from "../../../store/selector/modalSelector";
import { FoldersSelector } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { file } from "../../../../../static/api";
import { setImages } from "../../../../../store/slices/foldersSlice";
import {
  settingsItemClosed,
  viewModalOpen,
} from "../../../store/modalSlice/modalSlice";

export const SettingsItemModal = () => {
  const dispatch = useDispatch();
  const { settingsItem } = useSelector(modalSelector);
  const { folderItem, folderImage, folderImages } =
    useSelector(FoldersSelector);

  const initialSeconds = folderImage?.timePerSlide
    ? folderImage.timePerSlide / 1000
    : folderItem.timePerSlide / 1000;
  const initialAnimation = folderImage?.transitionType
    ? folderImage.transitionType
    : folderItem.transitionType;
  const initialFilter = folderImage?.filter || "";

  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [animation, setAnimation] = React.useState(initialAnimation);
  const [filter, setFilter] = React.useState(initialFilter);

  React.useEffect(() => {
    setSeconds(initialSeconds);
    setAnimation(initialAnimation);
    setFilter(initialFilter);
  }, [folderImage, initialSeconds, initialAnimation, initialFilter]);

  const handleInputChange = (value) => {
    setSeconds((prevState) => value);
  };

  const handleAnimation = (value) => {
    setAnimation((prevState) => value);
  };

  const handleFilter = (value) => {
    setFilter((prevState) => value);
  };

  const handleViewModalOpen = (e) => {
    e.stopPropagation();
    dispatch(settingsItemClosed());
    dispatch(viewModalOpen());
  };

  const handleCancel = async () => {
    if (seconds !== initialSeconds || animation !== initialAnimation || filter !== initialFilter) {
      await axiosInstance.patch(`${file}/${folderImage.id}`, {
        timePerSlide: seconds * 1000,
        transitionType: animation,
        filter: filter || null,
      });
      const newArr = folderImages.map((item) => {
        if (item.id === folderImage.id) {
          return {
            ...item,
            timePerSlide: seconds * 1000,
            transitionType: animation,
            filter: filter || null,
          };
        } else {
          return item;
        }
      });
      dispatch(setImages(newArr));
    }

    setSeconds(0);
    setAnimation("");
    setFilter("");
    dispatch(settingsItemClosed());
  };

  return (
    <Modal
      centered={true}
      title={"Item settings"}
      closable={true}
      keyboard={true}
      open={settingsItem}
      footer={<></>}
      onCancel={handleCancel}
      className={"setting_modal"}
      maskStyle={{ backgroundColor: "rgba(0,0,0,0.1)" }}
    >
      <div className={"setting_modal__box"}>
        <img src={timer} alt={timer} />
        <p>Duration per image:</p>
        <InputNumber
          className={"box__input"}
          value={seconds}
          onChange={handleInputChange}
          max={15}
          min={2}
        />
      </div>

      <div className={"setting_modal__box"}>
        <img src={trans} alt={"transition"} />
        <p>Animation:</p>
        <Select
          value={animation}
          className={"box__select"}
          onChange={handleAnimation}
          options={SelectsOptions}
        />
      </div>

      <div className={"setting_modal__box"}>
        <img src={trans} alt={"filter"} />
        <p>Filter:</p>
        <Select
          value={filter}
          className={"box__select"}
          onChange={handleFilter}
          options={filterSelectOptions}
        />
      </div>

      <p>
        Item settings override. Try the
        <span
          className={"span"}
          title={"you can change items view at settings section"}
          onClick={handleViewModalOpen}
        >
          list view
        </span>
        for a full overview of timing and transitions.
      </p>
    </Modal>
  );
};
