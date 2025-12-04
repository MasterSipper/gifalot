import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useParams, useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useFullscreenMode } from "../../hooks/useFullScreen";
import { exitScreen, fullScreen } from "../../helpers/screen";
import { apiUrl, collections, file } from "../../static/api";
import axios from "axios";
import axiosInstance from "../../helpers/axiosConfig";
import { AnimationHandler } from "../dashboard/carousel/components";
import { Loader } from "../../components";
import { normalizeCollectionFiles } from "../../helpers/normalizeCollectionFiles";
import { FoldersSelector, UserInfo } from "../../store/selectors";
import { getFoldersImages, SetFolder } from "../../store/slices/foldersSlice";
import { routes } from "../../static/routes";
import { PlayerModal } from "./components/playerModal";
import { PrivateErrorModal } from "./components/privateErrorModal";
import { ErrorModal } from "../publicCarousel/components";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../dashboard/carousel/style.css";
import "animate.css";

export const Player = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Determine if this is a public or private player
  const isPublic = Boolean(params.userId && params.folderId);
  const isPrivate = Boolean(params.folder && !params.userId);
  
  const { folderImages, folderItem } = useSelector(FoldersSelector);
  const { userInfo, isAuth } = useSelector(UserInfo);
  const { isFullscreen } = useFullscreenMode();

  const [slideIndex, setSlideIndex] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isPrivateError, setIsPrivateError] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [catalogData, setCatalogData] = React.useState(null);
  const [isStop, setIsStop] = React.useState(false);
  
  // Reset slideIndex to 0 when play starts
  React.useEffect(() => {
    if (play && state.length > 0) {
      setSlideIndex(0);
      // Force carousel to go to first slide after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.moveTo(0);
        }
      }, 100);
    }
  }, [play, state.length]);

  const carouselRef = React.useRef();

  // Fetch data for public player
  const fetchPublicData = React.useCallback(async () => {
    setLoading(true);
    setIsPrivateError(false);
    setError(false);
    
    // Validate that userId and folderId are numeric
    const userIdNum = parseInt(params.userId, 10);
    const folderIdNum = parseInt(params.folderId, 10);
    
    if (isNaN(userIdNum) || isNaN(folderIdNum)) {
      console.log("Invalid route parameters - userId and folderId must be numbers");
      setError(true);
      setIsPrivateError(false);
      setLoading(false);
      return;
    }
    
    try {
      const [catalogResponse, filesResponse] = await Promise.all([
        axios.get(`${apiUrl}${collections}/${userIdNum}/${folderIdNum}`),
        axios.get(`${apiUrl}${file}/${userIdNum}/${folderIdNum}`),
      ]);

      const normalized = normalizeCollectionFiles(
        catalogResponse.data,
        filesResponse.data ?? [],
      );

      setCatalogData(catalogResponse.data);
      setState(normalized);
      setError(false);
      setIsPrivateError(false);
    } catch (err) {
      console.log("Public data fetch error:", err);
      console.log("Error response:", err.response);
      console.log("Error status:", err.response?.status);
      console.log("Error data:", err.response?.data);
      // Check if it's a private compilation error
      // Check status codes: 403 (Forbidden), 401 (Unauthorized), or 400 (Bad Request) with private-related message
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || errorData?.error || '';
      const errorCode = errorData?.error || errorData?.code || '';
      const errorString = JSON.stringify(errorData || {}).toLowerCase();
      
      const isPrivateCompilationError = 
        err.response?.status === 403 || 
        err.response?.status === 401 ||
        (err.response?.status === 400 && (
          errorCode === 'COLLECTION_IS_PRIVATE' ||
          errorMessage.toLowerCase().includes('private') ||
          errorString.includes('private') ||
          errorString.includes('collection_is_private')
        ));
      
      if (isPrivateCompilationError) {
        // Private compilation access denied
        // If user is logged in but gets 403, they're not the owner
        // If user is not logged in, they can't access private compilations
        console.log("Setting isPrivateError to true - detected private compilation error");
        setIsPrivateError(true);
        setError(false);
      } else {
        // Other errors
        console.log("Setting regular error - not a private compilation error");
        setError(true);
        setIsPrivateError(false);
      }
      setState([]);
    } finally {
      setLoading(false);
    }
  }, [params.folderId, params.userId]);

  // Load folder data for private player
  React.useEffect(() => {
    if (isPrivate && params.folder && userInfo?.id) {
      if (!folderItem || folderItem.id !== params.folder) {
        // Load folder metadata
        axiosInstance.get(`${collections}/${params.folder}`)
          .then((res) => {
            dispatch(SetFolder(res.data));
          })
          .catch((err) => {
            console.error('Error loading folder:', err);
            console.log('Private folder error status:', err.response?.status);
            // Check if it's a private compilation error
            if (err.response?.status === 403 || err.response?.status === 401) {
              setIsPrivateError(true);
              setError(false);
            } else {
              setError(true);
              setIsPrivateError(false);
            }
          });
        // Load folder images
        dispatch(getFoldersImages({ userId: userInfo.id, id: params.folder }));
      }
    }
  }, [isPrivate, params.folder, userInfo?.id, dispatch, folderItem]);

  // Update state when folderImages change (for private player)
  React.useEffect(() => {
    if (isPrivate && folderImages.length > 0 && folderItem) {
      const normalized = normalizeCollectionFiles(folderItem, folderImages);
      setState(normalized);
      setCatalogData(folderItem);
      setError(false);
    }
  }, [isPrivate, folderImages, folderItem]);

  // Fetch public data
  React.useEffect(() => {
    if (isPublic) {
      fetchPublicData();
    }
  }, [isPublic, fetchPublicData]);

  React.useEffect(() => {
    fullScreen();
  }, []);

  // Calculate total slides based on per-item templates
  const calculateTotalSlides = () => {
    let slides = 0;
    let idx = 0;
    const items = isPublic ? state : folderImages;
    const defaultTemplate = isPublic ? (catalogData?.template || "1up") : (folderItem?.template || "1up");
    
    while (idx < items.length) {
      const item = items[idx];
      const template = item?.template || defaultTemplate;
      const advanceBy = template === "2up" || template === "4up" ? 1 : 
                       template === "1up" ? 1 : 
                       template === "2next" ? 2 : 4;
      idx += advanceBy;
      slides++;
    }
    return slides;
  };

  // Auto-advance slides
  React.useEffect(() => {
    if (!play || state.length === 0) {
      return;
    }

    const totalSlides = calculateTotalSlides();
    let itemIdx = 0;
    for (let i = 0; i < slideIndex && itemIdx < state.length; i++) {
      const item = state[itemIdx];
      const defaultTemplate = isPublic ? (catalogData?.template || "1up") : (folderItem?.template || "1up");
      const template = item?.template || defaultTemplate;
      const advanceBy = template === "2up" || template === "4up" ? 1 : 
                       template === "1up" ? 1 : 
                       template === "2next" ? 2 : 4;
      itemIdx += advanceBy;
    }
    
    // Get duration from the current item, fallback to folder/catalog default, then 5000ms
    const currentItem = state[itemIdx];
    const duration = currentItem?.timePerSlide || 
                     (isPublic ? catalogData?.timePerSlide : folderItem?.timePerSlide) || 
                     5000;
    
    const timer = setTimeout(() => {
      setSlideIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalSlides;
        return nextIndex;
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [play, slideIndex, state, catalogData, folderItem, isPublic, calculateTotalSlides]);

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

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === "ArrowRight") {
        e.preventDefault();
        carouselRef?.current?.onClickNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        carouselRef?.current?.onClickPrev();
      } else if (e.code === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.code === "Space") {
        e.preventDefault();
        setIsStop(!isStop);
        if (isStop) {
          carouselRef?.current?.autoPlay();
        } else {
          carouselRef?.current?.clearAutoPlay();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStop]);

  const handleClose = async () => {
    exitScreen();
    if (isPrivate && params.folder) {
      await navigate(`/${routes.dashboard}/${params.folder}`);
    } else if (isPublic && params.folderId) {
      // For public player, just close or navigate to home
      await navigate(`/${routes.login}`);
    } else {
      await navigate(`/${routes.dashboard}`);
    }
  };

  const renderData = () => {
    const slides = [];
    let idx = 0;
    let slideIdx = 0;
    const items = state;
    const defaultTemplate = isPublic ? (catalogData?.template || "1up") : (folderItem?.template || "1up");
    
    while (idx < items.length) {
      const item = items[idx];
      const template = item?.template || defaultTemplate;
      
      let slideItems = [];
      let advanceBy = 1;
      
      if (template === "1up") {
        advanceBy = 1;
        slideItems = [item];
      } else if (template === "2next") {
        advanceBy = 2;
        slideItems = items.slice(idx, Math.min(idx + 2, items.length));
      } else if (template === "4next") {
        advanceBy = 4;
        slideItems = items.slice(idx, Math.min(idx + 4, items.length));
      } else if (template === "2up") {
        advanceBy = 1;
        slideItems = [item, item];
      } else if (template === "4up") {
        advanceBy = 1;
        slideItems = [item, item, item, item];
      }
      
      const isActive = slideIdx === slideIndex;
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
                      className={"carousel__item"}
                      src={image?.url}
                      onClick={(e) => e.stopPropagation()}
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
                      className={"carousel__item"}
                      src={image?.url}
                      alt={image?.name || "carousel item"}
                      onClick={(e) => e.stopPropagation()}
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

  const getCurrentTemplate = () => {
    if (state.length === 0) {
      return isPublic ? (catalogData?.template || "1up") : (folderItem?.template || "1up");
    }
    
    let idx = 0;
    let slideIdx = 0;
    const defaultTemplate = isPublic ? (catalogData?.template || "1up") : (folderItem?.template || "1up");
    
    while (idx < state.length && slideIdx < slideIndex) {
      const item = state[idx];
      const template = item?.template || defaultTemplate;
      
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
      return state[idx]?.template || defaultTemplate;
    }
    return defaultTemplate;
  };

  if (loading) {
    return <Loader />;
  }

  const folderId = isPublic ? params.folderId : params.folder;
  const collectionName = isPublic ? catalogData?.name : folderItem?.name;

  return (
    <div className={"carousel__wrapper"} onDoubleClick={handleClose}>
      <div className="carousel__version">
        <div>v1.0.6</div>
        <div className="carousel__template">{getCurrentTemplate()}</div>
      </div>
      <Carousel
        autoPlay={false}
        infiniteLoop
        ref={carouselRef}
        useKeyboardArrows={true}
        transitionTime={0}
        interval={5000}
        swipeable={!isPublic}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        onChange={(index) => {
          setSlideIndex(index);
        }}
        selectedItem={slideIndex}
        key={`carousel-${state.length}-${play}`} // Force re-render when play starts
      >
        {renderData()}
      </Carousel>

      {!isFullscreen && !error && !isPrivateError && (
        <PlayerModal
          handleChangePlay={setPlay}
          folderId={folderId}
          collectionName={collectionName}
          isPublic={isPublic}
        />
      )}
      {isPrivateError && <PrivateErrorModal />}
      {error && !isPrivateError && <ErrorModal />}
    </div>
  );
};

