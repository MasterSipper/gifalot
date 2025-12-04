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
  const [catalogData, setCatalogData] = React.useState(null);

  const carouselRef = React.useRef();

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

      setCatalogData(catalogResponse.data);
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

  // Calculate total slides based on per-item templates
  const calculateTotalSlides = () => {
    let slides = 0;
    let idx = 0;
    while (idx < state.length) {
      const item = state[idx];
      const template = item?.template || catalogData?.template || "1up";
      const advanceBy = template === "2up" || template === "4up" ? 1 : 
                       template === "1up" ? 1 : 
                       template === "2next" ? 2 : 4;
      idx += advanceBy;
      slides++;
    }
    return slides;
  };

  React.useEffect(() => {
    if (!play || state.length === 0) {
      return;
    }

    const totalSlides = calculateTotalSlides();
    // Get the first item index for current slide
    let itemIdx = 0;
    for (let i = 0; i < slideIndex && itemIdx < state.length; i++) {
      const item = state[itemIdx];
      const template = item?.template || catalogData?.template || "1up";
      const advanceBy = template === "2up" || template === "4up" ? 1 : 
                       template === "1up" ? 1 : 
                       template === "2next" ? 2 : 4;
      itemIdx += advanceBy;
    }
    
    const duration = state[itemIdx]?.timePerSlide || 5000;
    const timer = setTimeout(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, duration);

    return () => clearTimeout(timer);
  }, [play, slideIndex, state, catalogData, calculateTotalSlides]);

  React.useEffect(() => {
    if (state.length === 0 && slideIndex !== 0) {
      setSlideIndex(0);
    } else if (state.length > 0) {
      const totalSlides = calculateTotalSlides();
      if (slideIndex >= totalSlides) {
        setSlideIndex(0);
      }
    }
  }, [slideIndex, state.length, calculateTotalSlides]);

  // Add keyboard navigation for left/right arrow keys
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowRight") {
        e.preventDefault();
        carouselRef?.current?.onClickNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        carouselRef?.current?.onClickPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const renderData = () => {
    const slides = [];
    let idx = 0;
    let slideIdx = 0;
    
    while (idx < state.length) {
      const item = state[idx];
      const template = item?.template || catalogData?.template || "1up";
      
      // Determine items per slide and how to get items
      let slideItems = [];
      let itemsPerSlide = 1;
      let advanceBy = 1;
      
      if (template === "1up") {
        itemsPerSlide = 1;
        advanceBy = 1;
        slideItems = [item];
      } else if (template === "2next") {
        itemsPerSlide = 2;
        advanceBy = 2;
        slideItems = state.slice(idx, Math.min(idx + 2, state.length));
      } else if (template === "4next") {
        itemsPerSlide = 4;
        advanceBy = 4;
        slideItems = state.slice(idx, Math.min(idx + 4, state.length));
      } else if (template === "2up") {
        itemsPerSlide = 2;
        advanceBy = 1;
        slideItems = [item, item];
      } else if (template === "4up") {
        itemsPerSlide = 4;
        advanceBy = 1;
        slideItems = [item, item, item, item];
      }
      
      const isActive = slideIdx === slideIndex;
      
      // Use a normalized template name for CSS classes
      const cssTemplate = template === "2next" || template === "2up" ? "2up" :
                         template === "4next" || template === "4up" ? "4up" : "1up";
      
      slides.push(
        <div key={`slide-${slideIdx}`} className={`carousel__slide carousel__slide--${cssTemplate}`}>
          {slideItems.map((image, itemIdx) => {
            const isVideo = image?.mimeType && image.mimeType.startsWith('video/');
            const uniqueKey = template === "2up" || template === "4up" 
              ? `${image?.id}-${itemIdx}`
              : image?.id;
            
            return (
              <AnimationHandler
                key={uniqueKey}
                isActive={isActive}
                rotation={image?.rotation}
                type={image?.transitionType}
                time={image?.timePerSlide}
              >
                <div className={`carousel__item-wrapper carousel__item-wrapper--${cssTemplate}`}>
                  {isVideo ? (
                    <video
                      className={"public_carousel__img"}
                      src={image?.url}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      onLoadedMetadata={(e) => {
                        const video = e.target;
                        const aspectRatio = video.videoWidth / video.videoHeight;
                        if (aspectRatio > 1.1) {
                          video.classList.add('carousel__item--landscape');
                        } else if (aspectRatio < 0.9) {
                          video.classList.add('carousel__item--portrait');
                        } else {
                          video.classList.add('carousel__item--square');
                        }
                      }}
                    />
                  ) : (
                    <img
                      className={"public_carousel__img"}
                      src={image?.url}
                      alt={image?.name}
                      onLoad={(e) => {
                        const img = e.target;
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        if (aspectRatio > 1.1) {
                          img.classList.add('carousel__item--landscape');
                        } else if (aspectRatio < 0.9) {
                          img.classList.add('carousel__item--portrait');
                        } else {
                          img.classList.add('carousel__item--square');
                        }
                      }}
                    />
                  )}
                </div>
              </AnimationHandler>
            );
          })}
        </div>
      );
      
      idx += advanceBy;
      slideIdx++;
    }
    
    return slides;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={"carousel__wrapper"}>
      <div className="carousel__version">
        <div>v1.0.6</div>
        <div className="carousel__template">
          {(() => {
            // Calculate which item is currently displayed based on slideIndex
            if (state.length === 0) return catalogData?.template || "1up";
            
            let idx = 0;
            let slideIdx = 0;
            
            while (idx < state.length && slideIdx < slideIndex) {
              const item = state[idx];
              const template = item?.template || catalogData?.template || "1up";
              
              if (template === "1up") {
                idx += 1;
              } else if (template === "2next" || template === "2up") {
                idx += template === "2up" ? 1 : 2;
              } else if (template === "4next" || template === "4up") {
                idx += template === "4up" ? 1 : 4;
              }
              slideIdx++;
            }
            
            if (idx < state.length) {
              return state[idx]?.template || catalogData?.template || "1up";
            }
            return catalogData?.template || "1up";
          })()}
        </div>
      </div>
      <Carousel
        autoPlay={false}
        infiniteLoop
        ref={carouselRef}
        useKeyboardArrows={true}
        transitionTime={0}
        interval={5000}
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
