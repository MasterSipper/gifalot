import React from "react";
import { Carousel } from "react-responsive-carousel";
import { ErrorModal, StartModal } from "./components";
import { useFullscreenMode } from "../../hooks/useFullScreen";
import { useParams } from "react-router";
import { apiUrl, collections, file } from "../../static/api";
import axios from "axios";
import { AnimationHandler } from "../dashboard/carousel/components";
import { Loader } from "../../components";

import "./style.css";

export const PublicCarousel = () => {
  const { folderId, userId } = useParams();

  const { isFullscreen } = useFullscreenMode();

  const [slideIndex, setSlideIndex] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = () => {
    setLoading(true);
    let catalog = null;

    axios
      .get(`${apiUrl}${collections}/${userId}/${folderId}`)
      .then((res) => {
        catalog = res.data;
      })
      .catch((err) => {
        if (err) {
          setError(true);
        }
      });

    axios
      .get(`${apiUrl}${file}/${userId}/${folderId}`)
      .then((res) => {
        const arr = catalog.ranks.reduce((acc, curr) => {
          const image = res.data.find((img) => img.id === curr);
          if (image) {
            const newImage = {
              ...image,
              timePerSlide: image.timePerSlide ?? catalog.timePerSlide,
              transitionType: image.transitionType ?? catalog.transitionType,
            };
            acc.push(newImage);
          }

          return acc;
        }, []);

        const sorted = res.data
          .sort((a, b) => a.id - b.id)
          .map((item) => ({
            ...item,
            timePerSlide: item.timePerSlide ?? catalog.timePerSlide,
            transitionType: item.transitionType ?? catalog.transitionType,
          }));

        const newArr =
          catalog.ranks.length > 1 && arr.length >= res.data.length
            ? arr
            : sorted;

        setState((prevState) => newArr);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (play) {
      const timer = setInterval(() => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % state?.length);
      }, state[slideIndex]?.timePerSlide);

      return () => clearInterval(timer);
    }
  }, [slideIndex, play]);

  const renderData = () =>
    state?.map((item, index) => {
      const isActive = slideIndex === index;

      return (
        <AnimationHandler
          key={item.id}
          isActive={isActive}
          rotation={item.rotation}
          type={item.transitionType}
          time={item.timePerSlide}
        >
          <img
            className={"public_carousel__img"}
            src={item.url}
            alt={item.name}
          />
        </AnimationHandler>
      );
    });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={"carousel__wrapper"}>
      <Carousel
        autoPlay={false}
        infiniteLoop
        useKeyboardArrows={true}
        transitionTime={0}
        interval={state[slideIndex]?.timePerSlide}
        swipeable={false}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        onChange={(index) => {
          setSlideIndex(index);
        }}
        selectedItem={slideIndex}
      >
        {renderData()}
      </Carousel>

      {!isFullscreen && !error && <StartModal handleChangePlay={setPlay} />}
      {error && <ErrorModal />}
    </div>
  );
};
