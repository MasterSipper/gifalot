import { LocalStorage } from "./storage";
import { folderImageKey, folderKey, foldersListKey } from "../static/storageKeys";

export const folderService = {
  getFolder: () => {
    try {
      const folder = LocalStorage.get(folderKey);
      return folder ? JSON.parse(folder) : null;
    } catch (e) {
      return null;
    }
  },
  setFolder: (folder) => {
    LocalStorage.set(folderKey, JSON.stringify(folder));
  },

  removeFolder: () => {
    LocalStorage.remove(folderKey);
  },

  getImages: () => {
    try {
      const images = LocalStorage.get(folderImageKey);
      return images ? JSON.parse(images) : [];
    } catch (e) {
      return [];
    }
  },

  setFolderImages: (images) => {
    LocalStorage.set(folderImageKey, JSON.stringify(images));
  },

  removeFolderImages: () => {
    LocalStorage.remove(folderImageKey);
  },

  // POC mode: Store list of all folders
  getFoldersList: () => {
    try {
      const folders = LocalStorage.get(foldersListKey);
      return folders ? JSON.parse(folders) : [];
    } catch (e) {
      return [];
    }
  },

  setFoldersList: (folders) => {
    LocalStorage.set(foldersListKey, JSON.stringify(folders));
  },

  addFolderToList: (folder) => {
    const folders = folderService.getFoldersList();
    // Check if folder already exists (by ID)
    const existingIndex = folders.findIndex(f => f.id === folder.id);
    if (existingIndex >= 0) {
      // Update existing folder
      folders[existingIndex] = folder;
    } else {
      // Add new folder
      folders.push(folder);
    }
    folderService.setFoldersList(folders);
    return folders;
  },

  removeFolderFromList: (folderId) => {
    const folders = folderService.getFoldersList();
    const filtered = folders.filter(f => f.id !== folderId);
    folderService.setFoldersList(filtered);
    return filtered;
  },
};
