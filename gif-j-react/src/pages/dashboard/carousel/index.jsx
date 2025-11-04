// first version of carousel

//
// import React from "react";
// import Slider from "react-slick";
// import { useNavigate } from "react-router";
// import { ControlSection } from "./components";
// import { useSelector } from "react-redux";
// import { shuffle } from "./helpers/shuffle";
// import { getFoldersImages } from "../../../store/slices/foldersSlice";
// import { FoldersSelector } from "../../../store/selectors";
// import { userService } from "../../../helpers/userService";
//
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
//
// export const Carousel = () => {
//   const navigate = useNavigate();
//   const { folderItem, folderImages } = useSelector(FoldersSelector);
//   const userId = userService.getUserId();
//   const [number, setNumber] = React.useState(0);
//   const [hover, setHover] = React.useState(false);
//   const [stop, setStop] = React.useState(false);
//   const [random, setRandom] = React.useState(false);
//   const [data, setData] = React.useState(folderImages);
//   const [state, setState] = React.useState([]);
//
//   const slickRef = React.createRef();
//
//   React.useEffect(() => {
//     window.document.documentElement.requestFullscreen().then();
//   }, []);
//
//   React.useEffect(() => {
//     dispatch(getFoldersImages({ userId, id: folderItem.id }));
//   }, []);
//
//   document.addEventListener("keydown", async (e) => {
//     console.log(e, "press");
//     e.stopPropagation();
//     if (e.code === "Space") {
//       onPress(e);
//     }
//     if (e.code === "ArrowRight") {
//       handleSkip(e);
//     }
//     if (e.code === "ArrowLeft") {
//       handlePrev(e);
//     }
//     if (e.code === "Escape") {
//       await handleClose(e);
//     }
//   });
//
//   const onPress = (e) => {
//     e.stopPropagation();
//     stop ? slickRef?.current?.slickPause() : slickRef?.current?.slickPlay();
//     setStop(!stop);
//   };
//
//   const handleClose = async (e) => {
//     e.stopPropagation();
//     if (window.document.fullscreenElement)
//       await window.document.exitFullscreen();
//     await navigate(-1);
//   };
//
//   const handleMouseEnter = (e) => {
//     e.stopPropagation();
//     setHover(true);
//   };
//
//   const handleMouseLeave = (e) => {
//     e.stopPropagation();
//     setTimeout(() => {
//       setHover(false);
//     }, 3000);
//   };
//
//   const handlePause = (e) => {
//     e.stopPropagation();
//     slickRef?.current?.slickPause();
//     setStop(true);
//   };
//   const handlePlay = (e) => {
//     e.stopPropagation();
//     slickRef?.current?.slickPlay();
//     setStop(false);
//   };
//
//   const handleSkip = (e) => {
//     e.stopPropagation();
//     slickRef?.current?.slickNext();
//   };
//
//   const handlePrev = (e) => {
//     e.stopPropagation();
//     slickRef?.current?.slickPrev();
//   };
//
//   const onRandom = (e) => {
//     e.stopPropagation();
//     setState((prevState) => shuffle(data));
//     setRandom(!random);
//   };
//
//   const settings = {
//     infinite: true,
//     speed: 1000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     autoplay: true,
//     autoplaySpeed: 8000,
//     adaptiveHeight: true,
//     initialSlide: 0,
//     beforeChange: (oldIndex, newIndex) => {
//       setNumber(newIndex);
//     },
//   };
//
//   const renderData = () =>
//     (random ? state : data)?.map((image) => {
//       return (
//         <img
//           key={image.id}
//           className={"carousel__item"}
//           src={image.url}
//           alt="carousel item"
//           onClick={(e) => e.stopPropagation()}
//         />
//       );
//     });
//
//   return (
//     <div className={"carousel__wrapper"}>
//       <div
//         className={"carousel__item__wrapper"}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={handleClose}
//       >
//         {data.length === 0 ? (
//           <h1 style={{ color: "white" }}>no data yet...</h1>
//         ) : (
//           <Slider ref={slickRef} {...settings}>
//             {renderData()}
//           </Slider>
//         )}
//
//         <ControlSection
//           isHover={hover}
//           onPlay={(e) => handlePlay(e)}
//           onSkip={(e) => handleSkip(e)}
//           onPause={(e) => handlePause(e)}
//           stop={stop}
//           isRandom={random}
//           onRandom={(e) => onRandom(e)}
//           number={data.length === 0 ? 0 : number + 1}
//           length={data.length}
//         />
//       </div>
//     </div>
//   );
// };
