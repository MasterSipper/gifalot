import React from "react";
import { EyeFilled } from "@ant-design/icons";
import { ImageMask } from "../../../../../components";

import "./style.css";

export const ImageListCard = ({ card }) => {
  const { url, name, rotation, mimeType } = card;
  const isVideo = mimeType && mimeType.startsWith('video/');
  const [isHovered, setIsHovered] = React.useState(false);
  const [mask, setMask] = React.useState(false);

  const maskOpen = () => {
    setMask(true);
  };

  const maskClose = () => {
    setMask(false);
    setIsHovered(false);
  };

  return (
    <div
      style={{}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? "image_list_card__hover" : "image_list_card"}
    >
      {isVideo ? (
        <video
          src={url}
          className={"image_list_card__img"}
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
          className={"image_list_card__img"}
          style={{
            opacity: isHovered ? "0.2" : "1",
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={maskOpen}
        />
      )}
      {isHovered && (
        <span className={"preview__gif"} onClick={maskOpen}>
          <EyeFilled className={"icon"} /> Preview
        </span>
      )}
      {mask && (
        <ImageMask close={maskClose} url={url} name={name} list={true} mimeType={mimeType} />
      )}
    </div>
  );
};
