import React from "react";
import { Outlet, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getFolders,
  getFoldersImages,
  SetFolder,
  SetFolders,
  setImages,
} from "../../store/slices/foldersSlice";
import { FoldersSelector, UserInfo } from "../../store/selectors";
import { Loader } from "../../components";
import axiosInstance from "../../helpers/axiosConfig";
import { collections } from "../../static/api";
import { FolderItem, FolderSection } from "./components";
import { useNavigate } from "react-router";
import { routes } from "../../static/routes";
import { getRandomGif } from "../../helpers/getRandomGif";
import { dragClosed } from "./store/modalSlice/modalSlice";

import "./style.css";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { foldersData, loading } = useSelector(FoldersSelector);
  const { userInfo } = useSelector(UserInfo);

  React.useEffect(() => {
    if (location.pathname === "/dashboard") {
      dispatch(getFolders());
      dispatch(SetFolder(null));
      dispatch(setImages([]));
      dispatch(dragClosed());
    }
  }, [location.pathname, dispatch]);

  const handleAddClick = async () => {
    try {
      const newFolder = {
        name: "[Unnamed compilation]",
        private: true,
      };
      const res = await axiosInstance.post(collections, newFolder);
      dispatch(SetFolder({ ...res.data, justCreated: true }));
      dispatch(SetFolders(res.data));
      navigate(`/${routes.dashboard}/${res.data.id}`);
    } catch (error) {
      console.error('Error creating compilation:', error);
      // Error notification will be handled by axios interceptor or we can add one here
    }
  };

  const toFolder = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(SetFolder(item));
    dispatch(getFoldersImages({ userId: userInfo.id, id: item.id }));
    navigate(`/${routes.dashboard}/${item?.id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!location.pathname.includes("/dashboard/") && (
        <div className={"dashboard"}>
          <h3>Your compilations</h3>

          <FolderSection>
            {foldersData?.map((folder) => {
              return (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  onClick={(e) => toFolder(e, folder)}
                />
              );
            })}
            <div className={"add_folder__container"} onClick={handleAddClick}>
              <p>Create new</p>
              <img src={getRandomGif()} alt="add folder" />
            </div>
          </FolderSection>
        </div>
      )}
      <Outlet />
    </>
  );
};
