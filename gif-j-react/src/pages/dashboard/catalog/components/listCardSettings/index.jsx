import React from "react";
import {
  DeleteOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { InputNumber, Select } from "antd";
import trans from "../../../assets/icons/transition.png";
import { templateSelectOptions, filterSelectOptions } from "../../../../../static/selectsOptions";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector, UserInfo } from "../../../../../store/selectors";
import { setImages, getFoldersImages } from "../../../../../store/slices/foldersSlice";
import { useFavorite } from "../../../../favourite/hooks/useFavorite";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { file, collections } from "../../../../../static/api";

import asFav from "../../../../../assets/icons/hurt_fav.png";
import addFav from "../../../../../assets/icons/heart-black.png";
import timer from "../../../assets/icons/timer.png";
import duplicateIcon from "../../../assets/icons/duplicate.png";

import "./style.css";

export const ListCardSettings = ({ onRemove, card }) => {
  const dispatch = useDispatch();

  const { timePerSlide, transitionType, id, isFavorite, rotation, template, filter } = card;

  const { folderItem, folderImages } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);
  const { addToFavorite, removeFromFav } = useFavorite();

  const initialSeconds = timePerSlide
    ? timePerSlide / 1000
    : folderItem.timePerSlide / 1000;
  const initialTemplate = template || folderItem?.template || "1up";
  const initialFilter = filter || "";

  const [addToFav, setAddToFav] = React.useState(isFavorite);
  const [time, setTime] = React.useState(initialSeconds);
  const [templateValue, setTemplateValue] = React.useState(initialTemplate);
  const [filterValue, setFilterValue] = React.useState(initialFilter);

  // Sync state when card prop changes (e.g., after reload from backend)
  React.useEffect(() => {
    const newInitialTemplate = template || folderItem?.template || "1up";
    const newInitialFilter = filter || "";
    setTemplateValue(newInitialTemplate);
    setFilterValue(newInitialFilter);
    setAddToFav(isFavorite);
    if (timePerSlide) {
      setTime(timePerSlide / 1000);
    } else if (folderItem?.timePerSlide) {
      setTime(folderItem.timePerSlide / 1000);
    }
  }, [card, template, filter, isFavorite, timePerSlide, folderItem?.template, folderItem?.timePerSlide]);

  const handleInputChange = async (value) => {
    setTime((prevState) => value);
    await axiosInstance.patch(`${file}/${id}`, {
      timePerSlide: value * 1000,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          timePerSlide: value * 1000,
        };
      } else {
        return item;
      }
    });
    dispatch(setImages(newArr));
  };

  const handleTemplate = async (value) => {
    setTemplateValue((prevState) => value);
    await axiosInstance.patch(`${file}/${id}`, {
      template: value,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          template: value,
        };
      } else {
        return item;
      }
    });
    dispatch(setImages(newArr));
  };

  const handleFilter = async (value) => {
    setFilterValue((prevState) => value);
    await axiosInstance.patch(`${file}/${id}`, {
      filter: value || null,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          filter: value || null,
        };
      } else {
        return item;
      }
    });
    dispatch(setImages(newArr));
  };

  const rotateRight = async () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = 0;
    }
    await axiosInstance.patch(`${file}/${id}`, {
      rotation: newRotation,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          rotation: newRotation,
        };
      } else {
        return item;
      }
    });
    dispatch(setImages(newArr));
  };

  const rotateLeft = async () => {
    let newRotation = rotation - 90;
    if (newRotation <= -360) {
      newRotation = 0;
    }
    await axiosInstance.patch(`${file}/${id}`, {
      rotation: newRotation,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          rotation: newRotation,
        };
      } else {
        return item;
      }
    });
    dispatch(setImages(newArr));
  };

  const handleAddToFav = async () => {
    await addToFavorite(id);
    setAddToFav(true);
  };
  const handleRemoveFromFav = async () => {
    await removeFromFav(id);
    setAddToFav(false);
  };

  const handleDuplicate = async () => {
    try {
      const response = await axiosInstance.post(`${file}/${id}/duplicate`);
      const newFile = response.data;
      
      // Find the index of the current item
      const currentIndex = folderImages.findIndex((item) => item.id === id);
      
      if (currentIndex === -1) {
        console.error('Current item not found');
        return;
      }
      
      // Insert the new file right after the current item
      const newArr = [
        ...folderImages.slice(0, currentIndex + 1),
        newFile,
        ...folderImages.slice(currentIndex + 1),
      ];
      
      // Update ranks in backend FIRST to maintain order
      const ranks = newArr.map((gif) => gif.id);
      await axiosInstance.patch(`${collections}/${folderItem.id}`, {
        ranks,
      });
      
      // Update local state after ranks are updated
      dispatch(setImages(newArr));
      
      // Reload images from backend to get full file data (URL, etc.) after a short delay
      setTimeout(() => {
        dispatch(getFoldersImages({ userId: userInfo.id, id: folderItem.id }));
      }, 100);
    } catch (error) {
      console.error('Error duplicating file:', error);
    }
  };

  return (
    <div className={"list_card_settings"}>
      {addToFav ? (
        <img
          className={"add__fav"}
          src={asFav}
          width={24}
          height={24}
          alt="hart_add"
          onClick={handleRemoveFromFav}
        />
      ) : (
        <img
          className={"add__fav"}
          src={addFav}
          width={24}
          height={24}
          alt="hurt_fav"
          onClick={handleAddToFav}
        />
      )}

      <div>
        <RotateLeftOutlined className={"icons"} onClick={rotateLeft} />
        <RotateRightOutlined
          className={"icons"}
          style={{ marginLeft: 15 }}
          onClick={rotateRight}
        />
      </div>

      <div className={"list_card_settings_box"}>
        <div className={"list_card_settings_field"}>
          <div className={"list_card_settings_label"}>
            <img src={timer} alt={timer} />
          </div>
          <InputNumber
            value={time}
            onChange={handleInputChange}
            style={{ width: "55px" }}
            max={15}
            min={2}
            formatter={(value) => value ? `${value}s` : ''}
            parser={(value) => value ? value.replace('s', '') : ''}
          />
        </div>
      </div>

      <div className={"list_card_settings_box"}>
        <div className={"list_card_settings_field"}>
          <div className={"list_card_settings_label"}>
            <img src={trans} alt={"template"} />
            <p>Template:</p>
          </div>
          <Select
            value={templateValue}
            style={{ width: 126 }}
            onChange={handleTemplate}
            options={templateSelectOptions}
          />
        </div>
      </div>

      <div className={"list_card_settings_box"}>
        <div className={"list_card_settings_field"}>
          <div className={"list_card_settings_label"}>
            <img src={trans} alt={"filter"} />
            <p>Filter:</p>
          </div>
          <Select
            value={filterValue}
            style={{ width: 126 }}
            onChange={handleFilter}
            options={filterSelectOptions}
          />
        </div>
      </div>

      <img
        src={duplicateIcon}
        alt="duplicate"
        className={"icons"}
        onClick={handleDuplicate}
        style={{ width: 24, height: 24, cursor: "pointer" }}
      />
      <DeleteOutlined onClick={onRemove} className={"icons"} />
    </div>
  );
};
