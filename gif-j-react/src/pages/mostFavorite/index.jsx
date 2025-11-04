import React from "react";
import { GridContainer, ImageCard, Loader } from "../../components";
import { Col } from "antd";
import { useMostFavorite } from "./hooks/useMostFavorite";

import "./style.css";

export const MostFavorite = () => {
  const [mostFavGif, setMostFavGif] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { fetchMostFav } = useMostFavorite();

  React.useEffect(() => {
    setLoading(true);
    fetchMostFav()
      .then((res) => setMostFavGif(res))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = () => {
    return mostFavGif?.map((item) => {
      return (
        <Col md={12} lg={8} xxl={6} key={item.id} className={"col"}>
          <ImageCard
            item={item}
            inMostFav={true}
            inCatalog={true}
            inFav={true}
          />
        </Col>
      );
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={"most_fav"}>
      <h3>Most hearted gifs</h3>
      <GridContainer
        height={"90vh"}
        id={"most-fav"}
        data={mostFavGif}
        setData={setMostFavGif}
      >
        {renderItem()}
      </GridContainer>
    </div>
  );
};
