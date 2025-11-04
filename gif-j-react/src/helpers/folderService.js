import { LocalStorage } from "./storage";
import { folderImageKey, folderKey } from "../static/storageKeys";

export const folderService = {
  getFolder: () => {
    return JSON.parse(LocalStorage.get(folderKey));
  },
  setFolder: (folder) => {
    LocalStorage.set(folderKey, JSON.stringify(folder));
  },

  removeFolder: () => {
    LocalStorage.remove(folderKey);
  },

  getImages: () => {
    return JSON.parse(LocalStorage.get(folderImageKey));
  },

  setFolderImages: (images) => {
    LocalStorage.set(folderImageKey, JSON.stringify(images));
  },

  removeFolderImages: () => {
    LocalStorage.remove(folderImageKey);
  },
};
