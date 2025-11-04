import React from "react";
import axiosInstance from "../../../../helpers/axiosConfig";
import { collections } from "../../../../static/api";
import { SetFolders } from "../../../../store/slices/foldersSlice";
import { useDispatch, useSelector } from "react-redux";
import { FoldersSelector } from "../../../../store/selectors";

export const FolderSection = ({ children }) => {
  const dispatch = useDispatch();
  const { foldersData } = useSelector(FoldersSelector);

  const listInnerRef = React.createRef();

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      if (scrollTop + clientHeight === scrollHeight) {
        const lastItem = foldersData
          .map((item) => item.id)
          .sort((a, b) => a - b)
          .pop();

        const res = await axiosInstance.get(
          `${collections}?lastId=${lastItem}`
        );

        dispatch(SetFolders(res.data));
      }
    }
  };

  return (
    <div className={"folders__section"} onScroll={onScroll} ref={listInnerRef}>
      {children}
    </div>
  );
};
