import React from "react";
import { getRandomGif } from "../../../../helpers/getRandomGif";

import "./style.css";

export const MockData = () => {
  return (
    <>
      <div className={"favorite__mock_item"}>
        <p>Where’s the love? You have to heart some gifs, friend &lt;3</p>
        <img src={getRandomGif()} alt="random gif" />
        <p>...or take a look at what other users have hearted .</p>
      </div>
    </>
  );
};
