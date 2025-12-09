import React from "react";
import { EyeFilled } from "@ant-design/icons";
import { ImageMask } from "../imageMask";
import { useFavorite } from "../../pages/favourite/hooks/useFavorite";
import { settingsItemOpen } from "../../pages/dashboard/store/modalSlice/modalSlice";
import { useDispatch } from "react-redux";
import { getFolderImage } from "../../store/slices/foldersSlice";
import { getRandomGif } from "../../helpers/getRandomGif";

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
  
  // Validate URL - use placeholder if invalid
  const validUrl = url && typeof url === 'string' && url.trim() !== '' ? url : getRandomGif();

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
          src={validUrl}
          className={"image_card__img"}
          style={{
            opacity: isHovered ? "0.2" : "1",
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={maskOpen}
          controls
          muted
          playsInline
          onLoadedMetadata={(e) => {
            const video = e.target;
            const aspectRatio = video.videoWidth / video.videoHeight;
            if (aspectRatio > 1.1) {
              video.classList.add('image_card__img--landscape');
            } else if (aspectRatio < 0.9) {
              video.classList.add('image_card__img--portrait');
            } else {
              video.classList.add('image_card__img--square');
            }
          }}
        />
      ) : (
        <img
          src={validUrl}
          alt={name}
          className={"image_card__img"}
          style={{
            opacity: isHovered ? "0.2" : "1",
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={maskOpen}
          onLoad={(e) => {
            const img = e.target;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio > 1.1) {
              img.classList.add('image_card__img--landscape');
            } else if (aspectRatio < 0.9) {
              img.classList.add('image_card__img--portrait');
            } else {
              img.classList.add('image_card__img--square');
            }
          }}
          onError={(e) => {
            // If image fails to load, use placeholder
            if (e.target.src !== getRandomGif()) {
              e.target.src = getRandomGif();
            }
          }}
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
          url={validUrl}
          name={name}
          id={id}
          deg={rotation}
          mimeType={mimeType}
        />
      )}
    </div>
  );
};
