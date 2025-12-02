import React from "react";
import { EyeFilled } from "@ant-design/icons";
import { ImageMask } from "../imageMask";
import { useFavorite } from "../../pages/favourite/hooks/useFavorite";
import { settingsItemOpen } from "../../pages/dashboard/store/modalSlice/modalSlice";
import { useDispatch } from "react-redux";
import { getFolderImage } from "../../store/slices/foldersSlice";

import addFav from "../../pages/dashboard/assets/icons/hurt_add.png";
import asFav from "../../assets/icons/hurt_fav.png";
import settings from "../../assets/icons/equalizer-line.png";
import remove from "../../assets/icons/delete-bin-line.png";

import "./style.css";

export const ImageCard = ({ item, onRemove, inCatalog, inMostFav, inFav }) => {
  const { url, id, name, isFavorite, rotation, mimeType } = item;
  const isVideo = mimeType && mimeType.startsWith('video/');
  const dispatch = useDispatch();
  const { addToFavorite, removeFromFav } = useFavorite();

  const [isHovered, setIsHovered] = React.useState(false);
  const [addToFav, setAddToFav] = React.useState(isFavorite);
  const [mask, setMask] = React.useState(false);

  const maskOpen = () => {
    setMask(true);
  };

  const maskClose = () => {
    setMask(false);
    setIsHovered(false);
  };

  const handleAddToFav = async (e) => {
    e.stopPropagation();
    await addToFavorite(id);
    setAddToFav(true);
  };

  const handleRemoveFromFav = async (e) => {
    e.stopPropagation();
    await removeFromFav(id);
    setAddToFav(false);
  };

  const handleImageSettingsOpen = (e) => {
    dispatch(getFolderImage(id));
    dispatch(settingsItemOpen());
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? "hover" : "image_card"}
    >
      {isVideo ? (
        <video
          src={url}
          className={"image_card__img"}
          style={{
            opacity: isHovered ? "0.2" : "1",
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={maskOpen}
          controls
          muted
          playsInline
        />
      ) : (
        <img
          src={url}
          alt={name}
          className={"image_card__img"}
          style={{
            opacity: isHovered ? "0.2" : "1",
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={maskOpen}
        />
      )}
      {isHovered && (
        <>
          {!inMostFav && (
            <img
              className={"preview__remove"}
              src={remove}
              alt={"remove"}
              onClick={onRemove}
            />
          )}
          <span className={"preview__gif"} onClick={maskOpen}>
            <EyeFilled className={"icon"} /> Preview
          </span>
          {inCatalog ? (
            addToFav ? (
              <img
                className={"preview__favorite"}
                src={asFav}
                alt="hart_add"
                onClick={(e) => handleRemoveFromFav(e)}
              />
            ) : (
              <img
                className={"preview__favorite"}
                src={addFav}
                alt="hurt_fav"
                onClick={(e) => handleAddToFav(e)}
              />
            )
          ) : (
            <img className={"fav_gif"} src={asFav} alt="hart_add" />
          )}

          {!inFav && (
            <img
              className={"preview__link"}
              src={settings}
              alt="link"
              onClick={handleImageSettingsOpen}
            />
          )}
        </>
      )}
      {mask && (
        <ImageMask
          close={maskClose}
          url={url}
          name={name}
          id={id}
          deg={rotation}
          mimeType={mimeType}
        />
      )}
    </div>
  );
};
