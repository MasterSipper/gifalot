import React from "react";
import { Carousel } from "react-responsive-carousel";
import { ErrorModal, StartModal } from "./components";
import { useFullscreenMode } from "../../hooks/useFullScreen";
import { useParams } from "react-router";
import { apiUrl, collections, file } from "../../static/api";
import axios from "axios";
import { AnimationHandler } from "../dashboard/carousel/components";
import { Loader } from "../../components";
import { normalizeCollectionFiles } from "../../helpers/normalizeCollectionFiles";

import "./style.css";

export const PublicCarousel = () => {
  const { folderId, userId } = useParams();

  const { isFullscreen } = useFullscreenMode();

  const [slideIndex, setSlideIndex] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [catalogResponse, filesResponse] = await Promise.all([
        axios.get(`${apiUrl}${collections}/${userId}/${folderId}`),
        axios.get(`${apiUrl}${file}/${userId}/${folderId}`),
      ]);

      const normalized = normalizeCollectionFiles(
        catalogResponse.data,
        filesResponse.data ?? [],
      );

      setState(normalized);
      setError(false);
    } catch (err) {
      setError(true);
      setState([]);
    } finally {
      setLoading(false);
    }
  }, [folderId, userId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    if (!play || state.length === 0) {
      return;
    }

    const duration = state[slideIndex]?.timePerSlide || 5000;
    const timer = setTimeout(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % state.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [play, slideIndex, state]);

  React.useEffect(() => {
    if (state.length === 0 && slideIndex !== 0) {
      setSlideIndex(0);
    } else if (slideIndex >= state.length && state.length > 0) {
      setSlideIndex(0);
    }
  }, [slideIndex, state.length]);

  const renderData = () =>
    state?.map((item, index) => {
      const isActive = slideIndex === index;
      const isVideo = item.mimeType && item.mimeType.startsWith('video/');

      return (
        <AnimationHandler
          key={item.id}
          isActive={isActive}
          rotation={item.rotation}
          type={item.transitionType}
          time={item.timePerSlide}
        >
          {isVideo ? (
            <video
              className={"public_carousel__img"}
              src={item.url}
              controls
              autoPlay
              muted
              playsInline
              loop
            />
          ) : (
            <img
              className={"public_carousel__img"}
              src={item.url}
              alt={item.name}
            />
          )}
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
