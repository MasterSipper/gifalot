import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rename: false,
  settings: false,
  access: false,
  search: false,
  drag: false,
  addLink: false,
  settingsItem: false,
  view: false,
};

export const renameModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    renameOpen: (_) => {
      _.rename = true;
    },
    renameClosed: (_) => {
      _.rename = false;
    },
    settingsOpen: (_) => {
      _.settings = true;
    },
    settingsClosed: (_) => {
      _.settings = false;
    },
    accessOpen: (_) => {
      _.access = true;
    },
    accessClosed: (_) => {
      _.access = false;
    },
    searchOpen: (_) => {
      _.search = true;
    },
    searchClosed: (_) => {
      _.search = false;
    },
    dragOpen: (_) => {
      _.drag = true;
    },
    dragClosed: (_) => {
      _.drag = false;
    },
    addLinkOpen: (_) => {
      _.addLink = true;
    },
    addLinkClosed: (_) => {
      _.addLink = false;
    },
    settingsItemOpen: (_) => {
      _.settingsItem = true;
    },
    settingsItemClosed: (_) => {
      _.settingsItem = false;
    },
    viewModalOpen: (_) => {
      _.view = true;
    },
    viewModalClosed: (_) => {
      _.view = false;
    },
  },
});

export const {
  renameOpen,
  renameClosed,
  settingsClosed,
  settingsOpen,
  accessClosed,
  accessOpen,
  searchOpen,
  searchClosed,
  dragOpen,
  dragClosed,
  addLinkOpen,
  addLinkClosed,
  settingsItemOpen,
  settingsItemClosed,
  viewModalOpen,
  viewModalClosed,
} = renameModalSlice.actions;

export default renameModalSlice.reducer;
