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

export const ImageMask = ({ url, name, close, id, deg, list = false, mimeType }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { folderImages } = useSelector(FoldersSelector);

  const [rotation, setRotation] = React.useState(deg);
  const isVideo = mimeType && mimeType.startsWith('video/');

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

  const handleCloseRef = React.useRef();
  
  const handleClose = React.useCallback(async () => {
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
  }, [list, location.pathname, id, rotation, folderImages, dispatch, close]);

  handleCloseRef.current = handleClose;

  // Handle keyboard dismissal and click outside
  React.useEffect(() => {
    const handleKeyDown = () => {
      if (handleCloseRef.current) {
        handleCloseRef.current();
      }
    };

    const handleClick = (e) => {
      if (e.target.classList.contains('mask_wrapper')) {
        if (handleCloseRef.current) {
          handleCloseRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={"mask_wrapper"} onClick={handleClose}>
      <div className="mask__content" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            ref={imgRef}
            src={url}
            style={{ transform: `rotate(${rotation}deg)` }}
            controls
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            ref={imgRef}
            src={url}
            alt={name}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </div>

      <ul className={"mask__top_panel"} onClick={(e) => e.stopPropagation()}>
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
