import React from "react";
import { useSelector } from "react-redux";
import { FoldersSelector } from "../../../../../store/selectors";
import { GridContainer, ListContainer } from "../../../../../components";

export const Container = ({ children }) => {
  const { folderItem } = useSelector(FoldersSelector);

  React.useEffect(() => {}, [folderItem?.view]);

  return folderItem?.view === "grid" ? (
    <GridContainer height={"65vh"}>{children}</GridContainer>
  ) : (
    <ListContainer>{children}</ListContainer>
  );
};
