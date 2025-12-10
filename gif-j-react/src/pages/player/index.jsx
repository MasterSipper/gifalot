import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useParams, useNavigate } from "react-router";
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
import { ErrorModal } from "./components/errorModal";
import { getVersion } from "../../helpers/version";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../dashboard/carousel/style.css";
import "animate.css";

export const Player = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  
  // Determine if this is a public or private player
  const isPublic = Boolean(params.userId && params.folderId);
  const isPrivate = Boolean(params.folder && !params.userId);
  
  const { folderImages, folderItem } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);
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
      if (process.env.NODE_ENV === 'development') {
        console.log("Invalid route parameters - userId and folderId must be numbers");
      }
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
      // Error logging - keep minimal for production
      const errorData = err.response?.data || {};
      const statusCode = err.response?.status || errorData.statusCode;
      const errorMessage = errorData.message || errorData.error || err.message || '';
      const errorCode = errorData.error || errorData.code || '';
      const errorString = JSON.stringify(errorData).toLowerCase();
      
      // Enhanced error logging for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log("=== Public Collection Access Error ===");
        console.log("API URL:", `${apiUrl}${collections}/${userIdNum}/${folderIdNum}`);
        console.log("Error:", err);
        console.log("Error response:", err.response);
        console.log("Error status:", statusCode);
        console.log("Error data:", errorData);
        console.log("Parsed error details:", {
          statusCode,
          errorMessage,
          errorCode,
          errorString: errorString.substring(0, 200)
        });
      }
      
      // Check for private compilation error indicators
      // A 403 Forbidden status typically means the compilation is private
      // A 401 Unauthorized might also indicate access issues
      const isPrivateCompilationError = 
        statusCode === 403 || // Forbidden - most common for private compilations
        statusCode === 401 || // Unauthorized - might indicate auth required
        errorCode === 'COLLECTION_IS_PRIVATE' ||
        errorMessage.toLowerCase().includes('private') ||
        errorMessage.toLowerCase().includes('collection_is_private') ||
        errorString.includes('private') ||
        errorString.includes('collection_is_private');
      
      if (isPrivateCompilationError) {
        // Private compilation access denied
        // Show PrivateErrorModal which explains the compilation is private
        // and provides options to create an account
        if (process.env.NODE_ENV === 'development') {
          console.log("✓ Detected private compilation error - showing PrivateErrorModal");
        }
        setIsPrivateError(true);
        setError(false);
      } else {
        // Other errors (404 Not Found, 500 Server Error, network errors, etc.)
        // Show generic ErrorModal
        if (process.env.NODE_ENV === 'development') {
          console.log("✗ Not a private compilation error - showing generic ErrorModal");
        }
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
      // Only load if folderItem is missing or different from current folder
      // This prevents unnecessary re-fetches when looping
      const folderId = parseInt(params.folder, 10);
      if (!folderItem || folderItem.id !== folderId) {
        // Load folder metadata
        axiosInstance.get(`${collections}/${params.folder}`, { timeout: 30000 })
          .then((res) => {
            dispatch(SetFolder(res.data));
          })
          .catch((err) => {
            // Log error (always log errors, not just in development)
            console.error('Error loading folder:', err);
            if (process.env.NODE_ENV === 'development') {
              console.log('Private folder error status:', err.response?.status);
            }
            // Check if it's a private compilation error
            if (err.response?.status === 403 || err.response?.status === 401) {
              setIsPrivateError(true);
              setError(false);
            } else {
              setError(true);
              setIsPrivateError(false);
            }
          });
        // Load folder images only if we don't already have them
        if (!folderImages.length || folderItem?.id !== folderId) {
          dispatch(getFoldersImages({ userId: userInfo.id, id: params.folder }));
        }
      }
    }
  }, [isPrivate, params.folder, userInfo?.id, dispatch, folderItem, folderImages.length]);

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
  const calculateTotalSlides = React.useCallback(() => {
    let slides = 0;
    let idx = 0;
    const items = isPublic ? state : folderImages;
    
    while (idx < items.length) {
      const item = items[idx];
      // Template is stored per-file, not per-collection, so use file template or default to "1up"
      const template = item?.template || "1up";
      const advanceBy = template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right" || template === "4up" || template === "4up-warhol" ? 1 : 
                       template === "1up" ? 1 : 
                       template === "2next" ? 2 : 4;
      idx += advanceBy;
      slides++;
    }
    return slides;
  }, [isPublic, state, folderImages]);

  // Auto-advance slides
  React.useEffect(() => {
    if (!play || state.length === 0) {
      return;
    }

    const totalSlides = calculateTotalSlides();
    let itemIdx = 0;
    for (let i = 0; i < slideIndex && itemIdx < state.length; i++) {
      const item = state[itemIdx];
      // Template is stored per-file, not per-collection, so use file template or default to "1up"
      const template = item?.template || "1up";
      const advanceBy = template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right" || template === "4up" || template === "4up-warhol" ? 1 : 
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
      if (carouselRef.current && play && state.length > 0) {
        const nextIndex = (slideIndex + 1) % totalSlides;
        // Update state first, then move carousel
        // The onChange handler will also fire, but that's okay
        setSlideIndex(nextIndex);
        // Use a small delay to ensure state update is processed
        setTimeout(() => {
          if (carouselRef.current && play) {
            carouselRef.current.moveTo(nextIndex);
          }
        }, 50);
      }
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

  const handleClose = React.useCallback(async () => {
    exitScreen();
    if (isPrivate && params.folder) {
      await navigate(`/${routes.dashboard}/${params.folder}`);
    } else if (isPublic && params.folderId) {
      // For public player, just close or navigate to home
      await navigate(`/${routes.login}`);
    } else {
      await navigate(`/${routes.dashboard}`);
    }
  }, [isPrivate, isPublic, params.folder, params.folderId, navigate]);

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
  }, [isStop, handleClose]);

  const renderData = () => {
    const slides = [];
    let idx = 0;
    let slideIdx = 0;
    const items = state;
    
    while (idx < items.length) {
      const item = items[idx];
      // Template is stored per-file, not per-collection, so use file template or default to "1up"
      const template = item?.template || "1up";
      
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
      } else if (template === "2up-mirror-left" || template === "2up-mirror-right") {
        advanceBy = 1;
        slideItems = [item, item];
      } else if (template === "4up") {
        advanceBy = 1;
        slideItems = [item, item, item, item];
      } else if (template === "4up-warhol") {
        advanceBy = 1;
        slideItems = [item, item, item, item];
      }
      
      const isActive = slideIdx === slideIndex;
      const cssTemplate = template === "2next" || template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right" ? "2up" :
                         template === "4next" || template === "4up" || template === "4up-warhol" ? "4up" : "1up";
      
      slides.push(
        <div key={`slide-${slideIdx}`} className={`carousel__slide carousel__slide--${cssTemplate}`}>
          {slideItems.map((image, itemIdx) => {
            const isVideo = image?.mimeType && image.mimeType.startsWith('video/');
            const uniqueKey = template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right" || template === "4up" || template === "4up-warhol"
              ? `${image?.id}-${itemIdx}`
              : image?.id;
            
            // Calculate aspect ratio from metadata if available, otherwise will be set on load
            // Note: For CSS object-fit, we use original dimensions (not swapped) because
            // the rotation transform is applied separately and object-fit works on the original image
            const width = image?.width;
            const height = image?.height;
            const aspectRatio = width && height ? width / height : null;
            
            // Determine orientation class from original aspect ratio (before rotation)
            // This ensures object-fit works correctly - rotation is handled by CSS transform
            let orientationClass = '';
            if (aspectRatio !== null) {
              if (aspectRatio > 1.1) {
                orientationClass = 'carousel__item--landscape';
              } else if (aspectRatio < 0.9) {
                orientationClass = 'carousel__item--portrait';
              } else {
                orientationClass = 'carousel__item--square';
              }
            }
            
            // For 2up, add slot position class (left or right)
            // For 4up and 4up-warhol, add slot position class (left column or right column)
            // For 4up-warhol, also add Warhol tint class
            let slotPosition = '';
            let warholTint = '';
            let filterClass = '';
            let mirrorClass = '';
            if (cssTemplate === '2up' && slideItems.length === 2) {
              slotPosition = itemIdx === 0 ? 'carousel__slot--left' : 'carousel__slot--right';
              // Add mirror class for mirror templates
              if (template === "2up-mirror-left" && itemIdx === 0) {
                mirrorClass = 'carousel__mirror--flip';
              } else if (template === "2up-mirror-right" && itemIdx === 1) {
                mirrorClass = 'carousel__mirror--flip';
              }
            } else if (cssTemplate === '4up' && slideItems.length === 4) {
              // 4up grid: 0,2 are left column, 1,3 are right column
              slotPosition = (itemIdx === 0 || itemIdx === 2) ? 'carousel__slot--left' : 'carousel__slot--right';
            }
            
            // Add Warhol tint class for 4up-warhol template (overrides any filter)
            if (template === "4up-warhol" && slideItems.length === 4) {
              // Warhol's Monroe: Yellow, Cyan, Magenta, Green tints
              const tints = ['warhol-yellow', 'warhol-cyan', 'warhol-magenta', 'warhol-green'];
              warholTint = `carousel__warhol--${tints[itemIdx]}`;
            } else if (image?.filter) {
              // Apply filter class only if not 4up-warhol template
              filterClass = `carousel__filter--${image.filter}`;
            }
            
            // Set CSS custom properties for precise control (use original dimensions)
            // Rotation is handled by CSS transform, not by swapping dimensions
            const styleProps = {
              ...(width && height ? {
                '--item-width': `${width}px`,
                '--item-height': `${height}px`,
                '--item-aspect-ratio': aspectRatio,
              } : {}),
            };
            
            // Get transition type with fallback to collection default
            const defaultTransitionType = isPublic 
              ? (catalogData?.transitionType || 'fadeInOut')
              : (folderItem?.transitionType || 'fadeInOut');
            const transitionType = image?.transitionType || defaultTransitionType;
            
            return (
              <AnimationHandler
                key={uniqueKey}
                isActive={isActive}
                rotation={image?.rotation}
                type={transitionType}
                time={image?.timePerSlide}
              >
                <div 
                  className={`carousel__item-wrapper carousel__item-wrapper--${cssTemplate} ${slotPosition} ${warholTint} ${filterClass} ${mirrorClass}`}
                  style={styleProps}
                >
                  {isVideo ? (
                    <video
                      className={`carousel__item ${orientationClass}`}
                      src={image?.url}
                      onClick={(e) => e.stopPropagation()}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      onLoadedMetadata={(e) => {
                        const video = e.target;
                        // Use metadata if available, otherwise use video dimensions
                        // Use original dimensions (not swapped) - rotation is handled by CSS transform
                        const finalWidth = width || video.videoWidth;
                        const finalHeight = height || video.videoHeight;
                        const finalAspectRatio = finalWidth / finalHeight;
                        
                        // Update CSS custom properties
                        const wrapper = video.closest('.carousel__item-wrapper');
                        if (wrapper) {
                          wrapper.style.setProperty('--item-width', `${finalWidth}px`);
                          wrapper.style.setProperty('--item-height', `${finalHeight}px`);
                          wrapper.style.setProperty('--item-aspect-ratio', finalAspectRatio.toString());
                        }
                        
                        // Add orientation class if not already set
                        if (!orientationClass) {
                          if (finalAspectRatio > 1.1) {
                            video.classList.add('carousel__item--landscape');
                          } else if (finalAspectRatio < 0.9) {
                            video.classList.add('carousel__item--portrait');
                          } else {
                            video.classList.add('carousel__item--square');
                          }
                        }
                      }}
                    />
                  ) : (
                    <img
                      className={`carousel__item ${orientationClass}`}
                      src={image?.url}
                      alt={image?.name || "carousel item"}
                      onClick={(e) => e.stopPropagation()}
                      onLoad={(e) => {
                        const img = e.target;
                        // Use metadata if available, otherwise use image dimensions
                        // Use original dimensions (not swapped) - rotation is handled by CSS transform
                        const finalWidth = width || img.naturalWidth;
                        const finalHeight = height || img.naturalHeight;
                        const finalAspectRatio = finalWidth / finalHeight;
                        
                        // Update CSS custom properties
                        const wrapper = img.closest('.carousel__item-wrapper');
                        if (wrapper) {
                          wrapper.style.setProperty('--item-width', `${finalWidth}px`);
                          wrapper.style.setProperty('--item-height', `${finalHeight}px`);
                          wrapper.style.setProperty('--item-aspect-ratio', finalAspectRatio.toString());
                        }
                        
                        // Add orientation class if not already set
                        if (!orientationClass) {
                          if (finalAspectRatio > 1.1) {
                            img.classList.add('carousel__item--landscape');
                          } else if (finalAspectRatio < 0.9) {
                            img.classList.add('carousel__item--portrait');
                          } else {
                            img.classList.add('carousel__item--square');
                          }
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
      // Template is stored per-file, not per-collection, so default to "1up"
      return "1up";
    }
    
    let idx = 0;
    let slideIdx = 0;
    
    while (idx < state.length && slideIdx < slideIndex) {
      const item = state[idx];
      // Template is stored per-file, not per-collection, so use file template or default to "1up"
      const template = item?.template || "1up";
      
      if (template === "1up") {
        idx += 1;
      } else if (template === "2next" || template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right") {
        idx += (template === "2up" || template === "2up-mirror-left" || template === "2up-mirror-right") ? 1 : 2;
      } else if (template === "4next" || template === "4up" || template === "4up-warhol") {
        idx += (template === "4up" || template === "4up-warhol") ? 1 : 4;
      }
      slideIdx++;
    }
    
    if (idx < state.length) {
      // Template is stored per-file, not per-collection, so use file template or default to "1up"
      return state[idx]?.template || "1up";
    }
    return "1up";
  };

  if (loading) {
    return <Loader />;
  }

  const folderId = isPublic ? params.folderId : params.folder;
  const collectionName = isPublic ? catalogData?.name : folderItem?.name;

  return (
    <div className={"carousel__wrapper"} onDoubleClick={handleClose}>
      <div className="carousel__version">
        <div>{getVersion()}</div>
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
          // Always update slideIndex when carousel changes
          // This ensures state stays in sync with carousel position
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

