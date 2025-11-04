import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { SettingsItemModal } from "../settingsItemModal";
import { ModalSearch, Drag, MockData, ButtonsSection } from "./components";
import { AddLinkModal } from "../addLinkModal";
import { Loader } from "../../../../../components";
import { Container } from "../container";
import { CardContainer } from "../cardContainer";
import { FoldersSelector } from "../../../../../store/selectors";
import {
  removeImage,
  setImages,
} from "../../../../../store/slices/foldersSlice";
import axiosInstance from "../../../../../helpers/axiosConfig";
import { collections, file } from "../../../../../static/api";

import "./style.css";

export const UploadSection = () => {
  const dispatch = useDispatch();

  const { folderImages, folderItem, imageLoading } =
    useSelector(FoldersSelector);
  const [gifs, setGifs] = React.useState([]);

  const sendRanks = async (data) => {
    // не забыть фиксануть, чтобы бек каждый раз не дергался
    const ranks = data.map((gif) => {
      return gif.id;
    });
    await axiosInstance.patch(`${collections}/${folderItem.id}`, {
      ranks,
    });
  };

  React.useEffect(() => {
    setGifs(folderImages);
  }, [folderImages]);

  const handleRemove = async (id) => {
    await axiosInstance.delete(`${file}/${id}`);

    dispatch(removeImage(id));
  };

  const moveCard = React.useCallback(
    (dragIndex, hoverIndex) => {
      const data = update(gifs, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, gifs[dragIndex]],
        ],
      });

      setGifs((prevCards) => data);
      sendRanks(data);
      dispatch(setImages(data));
    },
    [gifs]
  );

  const renderCard = () =>
    gifs?.map((card, index) => {
      if (imageLoading) {
        return <Loader key={index} />;
      }

      return (
        <CardContainer
          key={card.id}
          item={card}
          moveCard={moveCard}
          onRemove={() => handleRemove(card.id)}
          index={index}
        />
      );
    });

  return (
    <div className={"upload_wrapper"}>
      <ButtonsSection />

      <Drag />

      <DndProvider backend={HTML5Backend}>
        {gifs.length === 0 ? (
          <MockData />
        ) : (
          <Container>{renderCard()}</Container>
        )}
      </DndProvider>

      <AddLinkModal />

      <SettingsItemModal />

      <ModalSearch />
    </div>
  );
};
