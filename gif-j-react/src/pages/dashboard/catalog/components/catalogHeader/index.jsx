import React from "react";
import {
  accessOpen,
  dragOpen,
  renameOpen,
  settingsOpen,
} from "../../../store/modalSlice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FoldersSelector, UserInfo } from "../../../../../store/selectors";
import { SetFolder } from "../../../../../store/slices/foldersSlice";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections } from "../../../../../static/api";
import { useChromecast } from "../../../../../hooks/useChromecast";
import { RiCastLine } from "react-icons/ri";
import { Switch } from "antd";

import edit from "../../../../../assets/icons/edit.png";
import settings from "../../../assets/icons/settings.png";
import lock from "../../../assets/icons/lock.png";
import unlock from "../../../assets/icons/unlock.png";
import play from "../../../../../assets/icons/play.png";
// import share from "../../../../../assets/icons/share.png";
import list from "../../../../../assets/icons/listItems.png";
import grid from "../../../../../assets/icons/gridItems.png";
import shareBlack from "../../../assets/icons/share-fill__black.png";

import "./style.css";

export const CatalogHeader = ({ showTransitions, onToggleTransitions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { folderItem } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);
  const [display, setDisplay] = React.useState("grid");
  const { isAvailable, castToChromecast } = useChromecast();

  React.useEffect(() => {}, [folderItem.id]);
  React.useEffect(() => {
    setDisplay(folderItem?.view);
  }, [folderItem?.view]);

  const handleRenameFolder = () => {
    dispatch(renameOpen());
  };

  const handleSettingsOpen = () => {
    dispatch(settingsOpen());
  };

  const handleCarouselOpen = () => {
    navigate(`/player/${folderItem.id}`);
  };

  const handleDragEnter = (e) => {
    e.stopPropagation();
    dispatch(dragOpen());
  };

  const handleShareCarouselLink = async (e) => {
    e.stopPropagation();
    dispatch(accessOpen());
    // await navigator.clipboard.writeText(`${window.location.href}/carousel`);
    // notification.success({
    //   message: "link copied to clipboard",
    // });
  };

  const handleChromecast = (e) => {
    e.stopPropagation();
    // Use public player route for Chromecast (can be accessed without auth)
    // Use public URL from env if set, otherwise use current origin
    const publicUrl = process.env.REACT_APP_PUBLIC_URL || window.location.origin;
    const carouselUrl = `${publicUrl}/#/${userInfo?.id}/${folderItem.id}/carousel`;
    castToChromecast(carouselUrl);
  };

  const handleChangeView = async (view) => {
    setDisplay((prevState) => view);
    await axiosInstance.patch(`${collections}/${folderItem.id}`, {
      view: view,
    });
    const item = {
      ...folderItem,
      view: view,
    };
    dispatch(SetFolder(item));
  };

  return (
    <div className={"catalog__header"} onDragEnter={handleDragEnter}>
      <div className={"header__section"}>
        <p className={"section__text"}>{folderItem?.name}</p>
        <img
          className={"header__section__img"}
          width={20}
          height={20}
          src={edit}
          alt="edit"
          onClick={handleRenameFolder}
          title={"Edit"}
        />
      </div>

      <div className={"header__section"}>
        {display === "list" ? (
          <>
            <div className={"header__section__toggle"}>
              <span style={{ fontSize: "12px", marginRight: "8px" }}>Show Transitions</span>
              <Switch
                checked={showTransitions}
                onChange={onToggleTransitions}
                size="small"
              />
            </div>
            <img
              className={"header__section__img"}
              width={24}
              height={24}
              src={grid}
              alt="place"
              title={"View"}
              onClick={() => handleChangeView("grid")}
            />
          </>
        ) : (
          <img
            className={"header__section__img"}
            src={list}
            alt="place"
            title={"View"}
            onClick={() => handleChangeView("list")}
          />
        )}
        {folderItem?.private ? (
          <img src={lock} className={"header__section__private"} alt="lock" />
        ) : (
          <img
            src={unlock}
            className={"header__section__private"}
            alt="unlock"
          />
        )}
        <img
          className={"header__section__img"}
          src={settings}
          alt="settings"
          onClick={handleSettingsOpen}
          title={"Settings"}
        />
      </div>

      <div className={"header__section"}>
        <img
          src={shareBlack}
          className={"header__section__img"}
          alt="share link"
          onClick={handleShareCarouselLink}
          title={"Share link"}
        />

        <img
          src={play}
          className={"header__section__img"}
          alt="play"
          onClick={handleCarouselOpen}
          title={"Play"}
        />

        {isAvailable && (
          <RiCastLine
            className={"header__section__img"}
            style={{
              marginLeft: "17px",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={handleChromecast}
            title={"Cast to Chromecast"}
          />
        )}
        {/*<img*/}
        {/*  src={share}*/}
        {/*  alt="share"*/}
        {/*  className={"header__section__img"}*/}
        {/*  title={"Share"}*/}
        {/*/>*/}
      </div>
    </div>
  );
};
