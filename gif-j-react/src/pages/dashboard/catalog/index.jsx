import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { renameOpen } from "../store/modalSlice/modalSlice";
import { RemoveFolder } from "../../../store/slices/foldersSlice";
import axiosInstance from "../../../helpers/axiosConfig";
import { collections } from "../../../static/api";
import { FoldersSelector } from "../../../store/selectors";
import {
  UploadSection,
  RenameModal,
  SettingModal,
  CatalogHeader,
  AccessModal,
  ViewModal,
} from "./components";
import { Button } from "antd";
import { Loader } from "../../../components";

import "./style.css";

export const Catalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { folderItem, imageLoading } = useSelector(FoldersSelector);

  React.useEffect(() => {
    if (folderItem?.justCreated) {
      dispatch(renameOpen());
    }
  }, []);

  const handleDelete = async () => {
    dispatch(RemoveFolder(folderItem.id));
    await axiosInstance.delete(`${collections}/${folderItem.id}`);
    navigate("/dashboard");
  };

  if (imageLoading) {
    return <Loader />;
  }

  return (
    <>
      {!location.pathname.includes(`/dashboard/${folderItem?.id}/`) && (
        <div className={"catalog"}>
          <h3>Your Gifs</h3>
          <div className={"catalog__wrapper"}>
            <CatalogHeader />

            <UploadSection />

            <Button
              danger
              className={"delete__button"}
              onClick={() => handleDelete()}
            >
              Delete compilation
            </Button>
          </div>
          <RenameModal />
          <SettingModal />

          <AccessModal />
          <ViewModal />
        </div>
      )}
      <Outlet />
    </>
  );
};
