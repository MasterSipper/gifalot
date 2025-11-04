import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosConfig";
import { collections, file } from "../../static/api";
import { notification } from "antd";
import { folderService } from "../../helpers/folderService";

export const getFolders = createAsyncThunk(
  "folder/get",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(collections);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
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
      return thunkAPI.rejectWithValue({ error: error });
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

      notification.open({
        message: `something goes wrong`,
      });
    });
    builder.addCase(getFoldersImages.pending, (state) => {
      state.imageLoading = true;
    });
    builder.addCase(getFoldersImages.fulfilled, (state, { payload }) => {
      state.imageLoading = false;

      const arr = state?.folderItem.ranks.reduce((acc, curr) => {
        const image = payload.find((img) => img.id === curr);
        if (image) {
          const newImage = {
            ...image,
            timePerSlide: image.timePerSlide ?? state?.folderItem?.timePerSlide,
          };
          acc.push(newImage);
        }

        return acc;
      }, []);

      const sorted = payload
        .sort((a, b) => a.id - b.id)
        .map((item) => ({
          ...item,
          timePerSlide: item.timePerSlide ?? state?.folderItem?.timePerSlide,
        }));

      state.folderImages =
        state?.folderItem.ranks.length > 1 && arr.length >= payload.length
          ? arr
          : sorted;
      folderService.setFolderImages(sorted);
    });
    builder.addCase(getFoldersImages.rejected, (state, { payload }) => {
      state.imageLoading = false;
      notification.open({
        message: `something goes wrong`,
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
