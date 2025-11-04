import React from "react";
import {Carousel} from "react-responsive-carousel";

import {AnimationHandler, CarouselModal} from "./components";
import {useNavigate} from "react-router";
import {FoldersSelector} from "../../../store/selectors";
import {useSelector} from "react-redux";
import {exitScreen, fullScreen} from "../../../helpers/screen";
import {useFullscreenMode} from "../../../hooks/useFullScreen";
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
    // const { userInfo } = useSelector(UserInfo);
    // const { folderItem } = useSelector(FoldersSelector);

    const {folderImages} = useSelector(FoldersSelector);
    const {isFullscreen} = useFullscreenMode();

    // const { isRandom, isHover } = useSelector(carouselSelector);

    // const [state, setState] = React.useState(folderImages);

    const [isStop, setIsStop] = React.useState(false);

    const [slideIndex, setSlideIndex] = React.useState(0);

    const carouselRef = React.useRef();

    React.useEffect(() => {
        fullScreen();
    }, []);

    React.useEffect(() => {
        if(folderImages.length !==0){
            const timer = setInterval(() => {
                setSlideIndex((prevIndex) => (prevIndex + 1) % folderImages?.length);
            }, folderImages[slideIndex]?.timePerSlide);

            return () => clearInterval(timer);
        }

    }, [slideIndex, folderImages.length]);

    // const onRandom = (e) => {
    //   e.stopPropagation();
    //   setState(shuffle(folderImages));
    //   dispatch(setRandom(!isRandom));
    // };

    const handleClose = async (e) => {
        e.stopPropagation();
        exitScreen();
        await navigate("/dashboard");
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

    const keyPress = async (e) => {
        e.stopPropagation();
        if (e.code === "Escape") {
            await navigate("/dashboard");
        }
        if (e.code === "Space") {
            setIsStop(!isStop);
            if (isStop) {
                carouselRef?.current?.autoPlay();
            } else {
                carouselRef?.current?.clearAutoPlay();
            }
        }

        if (e.code === "ArrowRight") {
            carouselRef?.current?.onClickNext();
        }

        if (e.code === "ArrowLeft") {
            carouselRef?.current?.onClickPrev();
        }
    };

    const renderData = () =>
        folderImages?.map((image, index) => {
            const isActive = index === slideIndex;

            return (
                <AnimationHandler
                    key={image?.id}
                    time={image?.timePerSlide}
                    type={image?.transitionType}
                    isActive={isActive}
                    rotation={image?.rotation}
                >
                    <div
                        className={"carousel__slide"}
                        // onMouseEnter={handleMouseEnter}
                        // onMouseLeave={handleMouseLeave}
                    >
                        <img
                            className={"carousel__item"}
                            src={image?.url}
                            alt="carousel item"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </AnimationHandler>
            );
        });

    return (
        <div
            className={"carousel__wrapper"}
            onKeyDown={keyPress}
            onDoubleClick={handleClose}
        >
            <Carousel
                autoPlay={false}
                infiniteLoop
                ref={carouselRef}
                useKeyboardArrows={true}
                transitionTime={0}
                interval={folderImages[slideIndex]?.timePerSlide}
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
