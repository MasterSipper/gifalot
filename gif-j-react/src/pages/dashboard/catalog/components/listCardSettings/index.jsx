import React from "react";
import {
  DeleteOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import { InputNumber, Select } from "antd";
import trans from "../../../assets/icons/transition.png";
import { SelectsOptions } from "../../../../../static/selectsOptions";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import { setImages } from "../../../../../store/slices/foldersSlice";
import { useFavorite } from "../../../../favourite/hooks/useFavorite";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { file } from "../../../../../static/api";

import asFav from "../../../../../assets/icons/hurt_fav.png";
import addFav from "../../../../../assets/icons/heart-black.png";
import timer from "../../../assets/icons/timer.png";

import "./style.css";

export const ListCardSettings = ({ onRemove, card }) => {
  const dispatch = useDispatch();

  const { timePerSlide, transitionType, id, isFavorite, rotation } = card;

  const { folderItem, folderImages } = useSelector(FoldersSelector);
  const { addToFavorite, removeFromFav } = useFavorite();

  const initialSeconds = timePerSlide
    ? timePerSlide / 1000
    : folderItem.timePerSlide / 1000;
  const initialAnimation = transitionType
    ? transitionType
    : folderItem.transitionType;

  const [addToFav, setAddToFav] = React.useState(isFavorite);
  const [time, setTime] = React.useState(initialSeconds);
  const [animation, setAnimation] = React.useState(initialAnimation);

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

  const handleAnimation = async (value) => {
    setAnimation((prevState) => value);
    await axiosInstance.patch(`${file}/${id}`, {
      transitionType: value,
    });
    const newArr = folderImages.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          transitionType: value,
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
        <img src={timer} alt={timer} />

        <InputNumber
          defaultValue={time}
          onChange={handleInputChange}
          style={{ width: "55px", margin: "0 10px" }}
          max={15}
          min={2}
        />
        <p>Seconds</p>
      </div>

      <div className={"list_card_settings_box"}>
        <img src={trans} alt={"transition"} />
        <p style={{ margin: "0 10px" }}>Transition:</p>
        <Select
          defaultValue={animation}
          style={{ width: 126 }}
          onChange={handleAnimation}
          options={SelectsOptions}
        />
      </div>

      <DeleteOutlined onClick={onRemove} className={"icons"} />
    </div>
  );
};
