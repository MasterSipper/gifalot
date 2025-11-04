import React from "react";
import { useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import { ListCard } from "../listCard";
import { Card } from "../uploadSection/components";
import { Col } from "antd";
import { ImageCard } from "../../../../../components";
import { ImageListCard } from "../imageListCard";
import { ListCardSettings } from "../listCardSettings";

export const CardContainer = ({ onRemove, index, item, moveCard }) => {
  const { folderItem } = useSelector(FoldersSelector);

  React.useEffect(() => {}, [folderItem.view]);

  return folderItem.view === "grid" ? (
    <Col md={12} lg={8} xxl={6} key={item.id} className={"col"}>
      <Card index={index} item={item} moveCard={moveCard} className={"card"}>
        <ImageCard inCatalog={true} item={item} onRemove={onRemove} />
      </Card>
    </Col>
  ) : (
    <ListCard>
      <Card
        index={index}
        item={item}
        moveCard={moveCard}
        className={"list__card"}
      >
        <ImageListCard card={item} />
        <ListCardSettings onRemove={onRemove} card={item} />
      </Card>
    </ListCard>
  );
};
