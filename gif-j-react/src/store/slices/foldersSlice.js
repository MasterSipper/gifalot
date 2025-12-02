import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosConfig";
import { collections, file } from "../../static/api";
import { notification } from "antd";
import { folderService } from "../../helpers/folderService";
import { normalizeCollectionFiles } from "../../helpers/normalizeCollectionFiles";

export const getFolders = createAsyncThunk(
  "folder/get",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(collections);
      return res.data;
    } catch (error) {
      // Extract only serializable error data
      const errorData = {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        } : null,
      };
      return thunkAPI.rejectWithValue({ error: errorData });
    }
  }
);

export const getFoldersImages = createAsyncThunk(
  "folder/getImages",
  async ({ userId, id }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`${file}/${userId}/${id}`);
      return res.data;
    } catch (error) {
      // Extract only serializable error data
      const errorData = {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        } : null,
      };
      return thunkAPI.rejectWithValue({ error: errorData });
    }
  }
);

const folderItemData = folderService.getFolder();
const folderItemImage = folderService.getImages();

const initialState = {
  folderItem: folderItemData === null ? "" : folderItemData,
  foldersData: [],
  folderImages: folderItemImage === [] ? [] : folderItemImage,
  folderImage: null,
  loading: false,
  imageLoading: false,
};

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    SetFolder: (_, action) => {
      _.folderItem = action.payload;
      folderService.setFolder(action.payload);
    },
    RemoveFolder: (_, action) => {
      _.foldersData = _.foldersData.filter(
        (item) => item.id !== action.payload
      );
    },
    SetFolders: (_, action) => {
      _.foldersData = _.foldersData.concat(action.payload);
    },
    addImage: (_, action) => {
      _.folderImages = _.folderImages.concat(action.payload);

      folderService.setFolderImages(_.folderImages);
    },
    removeImage: (_, action) => {
      _.folderImages = _.folderImages.filter(
        (item) => item.id !== action.payload
      );
      folderService.setFolderImages(_.folderImages);
    },
    setImages: (_, action) => {
      _.folderImages = action.payload;
      folderService.setFolderImages(action.payload);
    },
    getFolderImage: (_, { payload }) => {
      const [image] = _.folderImages.filter((item) => item.id === payload);

      _.folderImage = image;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFolders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFolders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.foldersData = payload;
    });
    builder.addCase(getFolders.rejected, (state, { payload }) => {
      state.loading = false;

      const errorMessage = payload?.error?.response?.data?.message || 
                          payload?.error?.message || 
                          "Failed to load compilations";
      
      console.error('Error loading folders:', payload?.error);
      
      notification.error({
        message: "Error loading compilations",
        description: errorMessage,
      });
    });
    builder.addCase(getFoldersImages.pending, (state) => {
      state.imageLoading = true;
    });
    builder.addCase(getFoldersImages.fulfilled, (state, { payload }) => {
      state.imageLoading = false;

      const normalized = normalizeCollectionFiles(
        state.folderItem,
        payload ?? [],
      );
      state.folderImages = normalized;
      folderService.setFolderImages(normalized);
    });
    builder.addCase(getFoldersImages.rejected, (state, { payload }) => {
      state.imageLoading = false;
      
      const errorMessage = payload?.error?.response?.data?.message || 
                          payload?.error?.message || 
                          "Failed to load compilation images";
      
      console.error('Error loading folder images:', payload?.error);
      
      notification.error({
        message: "Error loading images",
        description: errorMessage,
      });
    });
  },
});

export const {
  SetFolders,
  SetFolder,
  RemoveFolder,
  addImage,
  removeImage,
  setImages,
  getFolderImage,
} = folderSlice.actions;

export default folderSlice.reducer;
