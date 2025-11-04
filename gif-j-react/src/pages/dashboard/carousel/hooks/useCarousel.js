// import React from "react";
// import { useSelector } from "react-redux";
// import { FoldersSelector } from "../../../../store/selectors";
//
// export function useCarousel() {
//   const { folderImages, folderItem } = useSelector(FoldersSelector);
//
//   const [carouselItems, setCarouselItems] = React.useState([]);
//
//   React.useEffect(() => {
//     const arr = folderImages.map((item) => ({
//       ...item,
//       timePerSlide: item.timePerSlide ?? folderItem.timePerSlide,
//     }));
//
//     console.log(arr);
//
//     setCarouselItems(arr);
//   }, []);
//
//   return { carouselItems };
// }
