import React from "react";
import {
  CloseOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";

import axiosInstance from "../../helpers/axiosConfig";
import { file } from "../../static/api";
import { setImages } from "../../store/slices/foldersSlice";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../store/selectors";
import { useLocation } from "react-router";

import "./style.css";

export const ImageMask = ({ url, name, close, id, deg, list = false }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { folderImages } = useSelector(FoldersSelector);

  const [rotation, setRotation] = React.useState(deg);

  const imgRef = React.useRef();

  const rotateRight = () => {
    let newRotation = rotation + 90;
    if (newRotation >= 360) {
      newRotation = 0;
    }
    setRotation((prevState) => newRotation);
  };

  const rotateLeft = () => {
    let newRotation = rotation - 90;
    if (newRotation <= -360) {
      newRotation = 0;
    }
    setRotation((prevState) => newRotation);
  };

  const handleClose = async () => {
    if (!list && location.pathname.includes("/dashboard/")) {
      await axiosInstance.patch(`${file}/${id}`, {
        rotation: rotation,
      });

      const newArr = folderImages.map((item) => {
        if (item.id === id) {
          return { ...item, rotation: rotation };
        } else {
          return item;
        }
      });
      dispatch(setImages(newArr));
    }

    close();
  };

  return (
    <div className={"mask_wrapper"}>
      <img
        ref={imgRef}
        src={url}
        alt={name}
        style={{ transform: `rotate(${rotation}deg)` }}
      />

      <ul className={"mask__top_panel"}>
        {!list && location.pathname.includes("/dashboard/") && (
          <>
            <li className={"top_panel__item"}>
              <RotateLeftOutlined
                className={"item__icon"}
                onClick={rotateLeft}
              />
            </li>
            <li className={"top_panel__item"} onClick={rotateRight}>
              <RotateRightOutlined className={"item__icon"} />
            </li>
          </>
        )}
        <li className={"top_panel__item"} onClick={handleClose}>
          <CloseOutlined className={"item__icon"} />
        </li>
      </ul>
    </div>
  );
};
