import React from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getRandomGif } from "../../../../helpers/getRandomGif";
import {
  getFoldersImages,
  SetFolder,
} from "../../../../store/slices/foldersSlice";
import { UserInfo } from "../../../../store/selectors";

import play from "../../assets/icons/play-circle-line.png";
// import share from "../../assets/icons/share.png";

import "./style.css";

export const FolderItem = ({ folder, onClick }) => {
  const { id, name, coverImageUrl } = folder;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(UserInfo);
  const handleCarouselOpen = (e) => {
    e.stopPropagation();
    dispatch(SetFolder(folder));
    dispatch(getFoldersImages({ userId: userInfo.id, id }));
    navigate(`/dashboard/${id}/carousel`);
  };

  // const handleShare = (e) => {
  //   e.stopPropagation();
  // };

  function fixedName() {
    if (name.length > 15) {
      return `${name.substring(0, 8)}...`;
    } else {
      return name;
    }
  }

  const renderItems = () => {
    if (coverImageUrl === null || coverImageUrl === undefined) {
      return <img src={getRandomGif()} alt={"random_image"} />;
    } else {
      return <img src={coverImageUrl} alt={"firstImage"} />;
    }
  };

  return (
    <div className={"folder_item"} onClick={onClick}>
      <p>{fixedName()}</p>
      <div className={"images__section"}>{renderItems()}</div>
      <div className={"icons__section"}>
        <img src={play} alt="play" onClick={(e) => handleCarouselOpen(e)} />
        {/*<img src={share} alt="share" title={"share"} onClick={(e) => handleShare(e)} />*/}
      </div>
    </div>
  );
};
