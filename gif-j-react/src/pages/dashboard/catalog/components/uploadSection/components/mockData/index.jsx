import React from "react";

import { getRandomGif } from "../../../../../../../helpers/getRandomGif";

import "./style.css";

export const MockData = () => {
  const randomGif = React.useMemo(() => getRandomGif(), []);
  return (
    <div className={"catalog__mock_item"}>
      <p>We are ready! Please start adding your gifs </p>
      <img src={randomGif} alt="random gif" />
    </div>
  );
};
