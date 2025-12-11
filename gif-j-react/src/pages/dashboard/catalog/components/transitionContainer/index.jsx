import React from "react";
import { Select } from "antd";
import trans from "../../../assets/icons/transition.png";
import { SelectsOptions } from "../../../../../static/selectsOptions";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { file } from "../../../../../static/api";
import { setImages } from "../../../../../store/slices/foldersSlice";

import "./style.css";

export const TransitionContainer = ({ item, nextItem }) => {
  const dispatch = useDispatch();
  const { folderItem, folderImages } = useSelector(FoldersSelector);

  // Transition applies to the next item (the item that comes after this transition)
  const targetItem = nextItem || item;
  const initialAnimation = targetItem?.transitionType
    ? targetItem.transitionType
    : folderItem.transitionType;

  const [animation, setAnimation] = React.useState(initialAnimation);

  React.useEffect(() => {
    const currentAnimation = targetItem?.transitionType
      ? targetItem.transitionType
      : folderItem.transitionType;
    setAnimation(currentAnimation);
  }, [targetItem, folderItem.transitionType]);

  const handleAnimation = async (value) => {
    if (!targetItem) return;
    
    setAnimation(value);
    await axiosInstance.patch(`${file}/${targetItem.id}`, {
      transitionType: value,
    });
    const newArr = folderImages.map((img) => {
      if (img.id === targetItem.id) {
        return {
          ...img,
          transitionType: value,
        };
      } else {
        return img;
      }
    });
    dispatch(setImages(newArr));
  };

  if (!targetItem) {
    return null;
  }

  return (
    <div className={"transition_container"}>
      <div className={"transition_container__content"}>
        <div className={"transition_container__label"}>
          <img src={trans} alt={"transition"} />
          <p>Transition to next:</p>
        </div>
        <Select
          value={animation}
          className={"transition_container__select"}
          onChange={handleAnimation}
          options={SelectsOptions}
          placeholder="Select transition"
        />
      </div>
    </div>
  );
};


