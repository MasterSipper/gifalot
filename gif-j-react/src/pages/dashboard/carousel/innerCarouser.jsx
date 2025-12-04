import React from "react";
import {Carousel} from "react-responsive-carousel";

import {AnimationHandler, CarouselModal} from "./components";
import {useNavigate, useParams, useLocation} from "react-router";
import {FoldersSelector, UserInfo} from "../../../store/selectors";
import {useSelector, useDispatch} from "react-redux";
import {exitScreen, fullScreen} from "../../../helpers/screen";
import {useFullscreenMode} from "../../../hooks/useFullScreen";
import {routes} from "../../../static/routes";
import {getFoldersImages, SetFolder} from "../../../store/slices/foldersSlice";
import axiosInstance from "../../../helpers/axiosConfig";
import {collections} from "../../../static/api";
// import { shuffle } from "./helpers/shuffle";
// import { carouselSelector } from "./store/selector/carouselselector";
//
// import {
//   setHover,
//   setRandom,
//   setStop,
// } from "./store/carouselSlice/carouselSlice";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./style.css";
import "animate.css";


export const InnerCarouser = () => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    // const { userInfo } = useSelector(UserInfo);
    // const { folderItem } = useSelector(FoldersSelector);

    const dispatch = useDispatch();
    const {folderImages, folderItem} = useSelector(FoldersSelector);
    const {userInfo} = useSelector(UserInfo);
    const {isFullscreen} = useFullscreenMode();
    
    // Check if running as standalone player (not as overlay)
    const isStandalonePlayer = location.pathname.includes('/player/');
    
    // Load folder data if running as standalone player
    React.useEffect(() => {
        if (isStandalonePlayer && params.folder && userInfo?.id) {
            // Load folder metadata and images if not already loaded
            if (!folderItem || folderItem.id !== params.folder) {
                // Load folder metadata
                axiosInstance.get(`${collections}/${params.folder}`)
                    .then((res) => {
                        dispatch(SetFolder(res.data));
                    })
                    .catch((err) => {
                        console.error('Error loading folder:', err);
                    });
                // Load folder images
                dispatch(getFoldersImages({ userId: userInfo.id, id: params.folder }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStandalonePlayer, params.folder, userInfo?.id, dispatch, folderItem]);

    // const { isRandom, isHover } = useSelector(carouselSelector);

    // const [state, setState] = React.useState(folderImages);

    const [isStop, setIsStop] = React.useState(false);

    const [slideIndex, setSlideIndex] = React.useState(0);

    const carouselRef = React.useRef();

    React.useEffect(() => {
        fullScreen();
    }, []);

    // Add global keyboard event listener for navigation and controls
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
                // Navigate based on whether we're standalone or overlay
                if (isStandalonePlayer) {
                    await navigate(`/${routes.dashboard}/${params.folder || folderItem?.id}`);
                } else {
                    await navigate(`/${routes.dashboard}`);
                }
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
    }, [isStop, navigate, isStandalonePlayer, params.folder, folderItem?.id]);

    // Calculate total slides based on per-item templates
    const calculateTotalSlides = React.useCallback(() => {
        let slides = 0;
        let idx = 0;
        while (idx < folderImages.length) {
            const item = folderImages[idx];
            const template = item?.template || folderItem?.template || "1up";
            // For "next" templates, we advance by itemsPerSlide. For "up" templates, we advance by 1.
            const itemsPerSlide = template === "1up" ? 1 : 
                                 template === "2next" || template === "2up" ? 2 : 
                                 template === "4next" || template === "4up" ? 4 : 1;
            // For "up" templates, we only advance by 1 item (same item repeated)
            const advanceBy = template === "2up" || template === "4up" ? 1 : itemsPerSlide;
            idx += advanceBy;
            slides++;
        }
        return slides;
    }, [folderImages, folderItem]);

    // Get the first item index for the current slide
    const getCurrentSlideFirstItemIndex = React.useCallback(() => {
        let idx = 0;
        for (let i = 0; i < slideIndex && idx < folderImages.length; i++) {
            const item = folderImages[idx];
            const template = item?.template || folderItem?.template || "1up";
            // For "up" templates, we only advance by 1 item (same item repeated)
            const advanceBy = template === "2up" || template === "4up" ? 1 : 
                             template === "1up" ? 1 : 
                             template === "2next" ? 2 : 4;
            idx += advanceBy;
        }
        return idx;
    }, [folderImages, folderItem, slideIndex]);

    React.useEffect(() => {
        if(folderImages.length !==0){
            const totalSlides = calculateTotalSlides();
            const currentItemIdx = getCurrentSlideFirstItemIndex();
            
            const timer = setInterval(() => {
                setSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
            }, folderImages[currentItemIdx]?.timePerSlide || 5000);

            return () => clearInterval(timer);
        }

    }, [slideIndex, folderImages, folderItem, calculateTotalSlides, getCurrentSlideFirstItemIndex]);

    // const onRandom = (e) => {
    //   e.stopPropagation();
    //   setState(shuffle(folderImages));
    //   dispatch(setRandom(!isRandom));
    // };

    const handleClose = async (e) => {
        e.stopPropagation();
        exitScreen();
        // Navigate based on whether we're standalone or overlay
        if (isStandalonePlayer) {
            await navigate(`/${routes.dashboard}/${params.folder || folderItem?.id}`);
        } else {
            await navigate(`/${routes.dashboard}`);
        }
    };

    // const handlePlay = (e) => {
    //   e.stopPropagation();
    //   carouselRef?.current?.autoPlay();
    //   dispatch(setStop(false));
    // };
    //
    // const handlePause = (e) => {
    //   e.stopPropagation();
    //   carouselRef?.current?.clearAutoPlay();
    //   dispatch(setStop(true));
    // };
    //
    // const handleSkip = (e) => {
    //   e.stopPropagation();
    //   carouselRef?.current?.onClickNext();
    // };
    //
    // const handleMouseEnter = (e) => {
    //   e.stopPropagation();
    //   dispatch(setHover(true));
    // };
    //
    // const handleMouseLeave = (e) => {
    //   e.stopPropagation();
    //   setTimeout(() => {
    //     dispatch(setHover(false));
    //   }, 2000);
    // };

    // const getData = () => {
    //   // isRandom ? state : folderImages;
    //   return folderItem;
    // };


    const renderData = () => {
        const slides = [];
        let idx = 0;
        let slideIdx = 0;
        
        while (idx < folderImages.length) {
            const item = folderImages[idx];
            const template = item?.template || folderItem?.template || "1up";
            
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
                slideItems = folderImages.slice(idx, Math.min(idx + 2, folderImages.length));
            } else if (template === "4next") {
                itemsPerSlide = 4;
                advanceBy = 4;
                slideItems = folderImages.slice(idx, Math.min(idx + 4, folderImages.length));
            } else if (template === "2up") {
                advanceBy = 1; // Only advance by 1 since we're repeating the same item
                slideItems = [item, item]; // Repeat the same item twice
                console.log('2up template - creating slide with 2 items:', slideItems.length, 'items');
            } else if (template === "4up") {
                advanceBy = 1; // Only advance by 1 since we're repeating the same item
                slideItems = [item, item, item, item]; // Repeat the same item four times
            }
            
            const isActive = slideIdx === slideIndex;
            
            // Use a normalized template name for CSS classes
            // 2up uses horizontal side-by-side layout (not grid)
            const cssTemplate = template === "2next" || template === "2up" ? "2up" :
                               template === "4next" || template === "4up" ? "4up" : "1up";
            
            slides.push(
                <div key={`slide-${slideIdx}`} className={`carousel__slide carousel__slide--${cssTemplate}`}>
                    {slideItems.map((image, itemIdx) => {
                        const isVideo = image?.mimeType && image.mimeType.startsWith('video/');
                        const uniqueKey = template === "2up" || template === "4up" 
                            ? `${image?.id}-${itemIdx}` // Use index for repeated items
                            : image?.id;
                        
                        return (
                            <AnimationHandler
                                key={uniqueKey}
                                time={image?.timePerSlide}
                                type={image?.transitionType}
                                isActive={isActive}
                                rotation={image?.rotation}
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
                                                // Add class for CSS targeting
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
                                            alt="carousel item"
                                            onClick={(e) => e.stopPropagation()}
                                            onLoad={(e) => {
                                                const img = e.target;
                                                const aspectRatio = img.naturalWidth / img.naturalHeight;
                                                // Add class for CSS targeting
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

    return (
        <div
            className={"carousel__wrapper"}
            onDoubleClick={handleClose}
        >
            <div className="carousel__version">
                <div>v1.0.6</div>
                <div className="carousel__template">
                    {(() => {
                        // Calculate which item is currently displayed based on slideIndex
                        if (folderImages.length === 0) return folderItem?.template || "1up";
                        
                        let idx = 0;
                        let slideIdx = 0;
                        
                        while (idx < folderImages.length && slideIdx < slideIndex) {
                            const item = folderImages[idx];
                            const template = item?.template || folderItem?.template || "1up";
                            
                            if (template === "1up") {
                                idx += 1;
                            } else if (template === "2next" || template === "2up") {
                                idx += template === "2up" ? 1 : 2;
                            } else if (template === "4next" || template === "4up") {
                                idx += template === "4up" ? 1 : 4;
                            }
                            slideIdx++;
                        }
                        
                        if (idx < folderImages.length) {
                            return folderImages[idx]?.template || folderItem?.template || "1up";
                        }
                        return folderItem?.template || "1up";
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
                swipeable={true}
                showIndicators={false}
                showThumbs={false}
                showStatus={false}
                showArrows={false}
                onChange={(index, item) => {
                    setSlideIndex(index);
                }}
                selectedItem={slideIndex}
            >
                {folderImages?.length === 0 ? (
                    <h1 style={{color: "white"}}>no data yet...</h1>
                ) : (
                    renderData()
                )}
            </Carousel>

            {/*{isHover && (*/}
            {/*  <ControlSection*/}
            {/*    onPlay={handlePlay}*/}
            {/*    onSkip={handleSkip}*/}
            {/*    onPause={handlePause}*/}
            {/*    // onRandom={onRandom}*/}
            {/*    number={folderImages.length === 0 ? 0 : slideIndex + 1}*/}
            {/*    length={folderImages.length}*/}
            {/*  />*/}
            {/*)}*/}
            {!isFullscreen && <CarouselModal/>}
        </div>
    );
};
