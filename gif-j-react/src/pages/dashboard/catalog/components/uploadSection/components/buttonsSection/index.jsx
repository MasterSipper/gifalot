import React from "react";
import { Button } from "antd";
import {
  addLinkOpen,
  dragClosed,
  dragOpen,
  searchOpen,
} from "../../../../../store/modalSlice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector } from "../../../../../store/selector/modalSelector";

import link from "../../../../../../../assets/icons/linkBlue.png";
// import heart from "../../../../../../../assets/icons/heartRed.png";
import file from "../../../../../../../assets/icons/folderUpload.png";

import "./style.css";

export const ButtonsSection = () => {
  const { drag } = useSelector(modalSelector);

  const dispatch = useDispatch();
  const handleOpenDrag = () => {
    drag ? dispatch(dragClosed()) : dispatch(dragOpen());
  };

  const handleOpenLinkModal = () => {
    if (drag) {
      dispatch(dragClosed());
      dispatch(addLinkOpen());
    } else {
      dispatch(addLinkOpen());
    }
  };

  const handleOpenSearchModal = () => {
    if (drag) {
      dispatch(dragClosed());
      dispatch(searchOpen());
    } else dispatch(searchOpen());
  };

  const handleDragEnter = (e) => {
    e.stopPropagation();
    dispatch(dragOpen());
  };

  return (
    <div className={"upload_section__buttons"} onDragEnter={handleDragEnter}>
      <Button onClick={handleOpenSearchModal}>Add from Giphy</Button>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={handleOpenDrag}
      >
        Add from <img style={{ marginLeft: 5 }} src={file} alt={"file"} />
      </Button>

      <Button
        style={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={handleOpenLinkModal}
      >
        Add from <img style={{ marginLeft: 5 }} src={link} alt={"link"} />
      </Button>

      {/*<Button*/}
      {/*  style={{*/}
      {/*    display: "flex",*/}
      {/*    alignItems: "center",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  Add from <img style={{ marginLeft: 5 }} src={heart} alt={"fav"} />*/}
      {/*</Button>*/}
    </div>
  );
};
