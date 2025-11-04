// almost done carousel control section

import React from "react";

import { useSelector } from "react-redux";
import { carouselSelector } from "../../store/selector/carouselselector";

import share from "../../assets/icons/share-fill.png";
import play from "../../assets/icons/carousel_play.svg";
import pause from "../../assets/icons/pause-circle-fill.png";
import skip from "../../assets/icons/skip-forward-line.png";
import random from "../../assets/icons/random.png";

import "./style.css";

export const ControlSection = ({
  number,
  length,
  onPause,
  onPlay,
  onSkip,
  onRandom,
}) => {
  const { isHover, isRandom, isStop } = useSelector(carouselSelector);

  React.useEffect(() => {}, [isStop]);

  return (
    <div
      className={isHover ? "control" : "hidden"}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={() => console.log("down")}
    >
      <div className={"control__slides"}>
        <p className={"slides__current"}>{`${number}`}</p>
        <p className={"slides__all"}>{`/${length}`}</p>
      </div>

      {length > 1 && (
        <div className={"control__buttons"}>
          <button className={"buttons__item"} onClick={(e) => onRandom(e)}>
            <img
              className={isRandom ? "random" : ""}
              src={random}
              alt="random"
            />
            Random
          </button>
          {isStop ? (
            <button className={"buttons__item"} onClick={(e) => onPlay(e)}>
              <img className={"play"} src={play} alt="play" />
              Play
            </button>
          ) : (
            <button className={"buttons__item"} onClick={(e) => onPause(e)}>
              <img src={pause} alt="pause" />
              Stay
            </button>
          )}

          <button className={"buttons__item"} onClick={(e) => onSkip(e)}>
            <img src={skip} alt="skip" />
            Skip
          </button>
        </div>
      )}

      {length !== 0 && (
        <button className={"buttons__item"}>
          <img src={share} alt="share" />
          Share
        </button>
      )}
    </div>
  );
};
