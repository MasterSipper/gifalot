import React from "react";
import { Row } from "antd";
import { useMostFavorite } from "../../pages/mostFavorite/hooks/useMostFavorite";
import { fav } from "../../static/api";
import axiosInstance from "../../helpers/axiosConfig";

import "./styles.css";

export const GridContainer = ({ children, height, id, data, setData }) => {
  const [page, setPage] = React.useState(Math.ceil(data?.length / 100));
  const { fetchMostFav } = useMostFavorite();

  const imagesRef = React.useRef();

  const onScroll = async (e) => {
    e.stopPropagation();
    if (imagesRef.current && data) {
      const { scrollTop, scrollHeight, clientHeight } = imagesRef.current;
      const [lastItem] = data?.slice(-1);

      if (scrollTop + clientHeight === scrollHeight) {
        switch (id) {
          case "most-fav": {
            if (data.length >= 100) {
              const res = await fetchMostFav(page);
              setPage((prevState) => prevState + 1);
              setData((prevState) => prevState.concat(res));
            }
            return;
          }

          case "fav": {
            const res = await axiosInstance.get(
              `${fav}?date=${lastItem.favoriteDate}`
            );
            setData((prevState) => prevState.concat(res.data));
            return;
          }
          default:
            return;
        }
      }
    }
  };

  return (
    <Row
      gutter={[24, 24]}
      id={id}
      className={"grid__container"}
      style={{ maxHeight: height }}
      ref={imagesRef}
      onScroll={onScroll}
    >
      {children}
    </Row>
  );
};
