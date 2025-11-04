import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import carouselSlice from "../pages/dashboard/carousel/store/carouselSlice/carouselSlice";
import modalSlice from "../pages/dashboard/store/modalSlice/modalSlice";
import foldersSlice from "./slices/foldersSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    carousel: carouselSlice,
    modal: modalSlice,
    folders: foldersSlice,
  },
});
