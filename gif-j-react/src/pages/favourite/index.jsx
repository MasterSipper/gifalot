import React from "react";
import { MockData } from "./components";
import { useFavorite } from "./hooks/useFavorite";
import { GridContainer, ImageCard, Loader } from "../../components";
import { Col } from "antd";

import "./style.css";

export const Favorite = () => {
  const [favorite, setFavorite] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { removeFromFav, fetchFav } = useFavorite();

  React.useEffect(() => {
    setLoading(true);
    fetchFav()
      .then((res) => setFavorite(res))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (id) => {
    await removeFromFav(id);
    const newArr = favorite.filter((item) => item.id !== id);
    setFavorite((prevState) => newArr);
  };

  const renderItem = () => {
    return favorite?.map((item) => {
      return (
        <Col md={12} lg={8} xxl={6} key={item.id} className={"col"}>
          <ImageCard
            key={item.id}
            inFav={true}
            item={item}
            onRemove={() => removeItem(item.id)}
          />
        </Col>
      );
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={"favorite"}>
      <h3>Your Favourites</h3>

      {favorite.length ? (
        <GridContainer
          height={"auto"}
          id={"fav"}
          data={favorite}
          setData={setFavorite}
        >
          {renderItem()}
        </GridContainer>
      ) : (
        <MockData />
      )}
    </div>
  );
};
