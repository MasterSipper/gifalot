import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isStop: false,
  isRandom: false,
  isHover: false,
};

export const carouselSlice = createSlice({
  name: "carousel",
  initialState,
  reducers: {
    setStop: (_, action) => {
      _.isStop = action.payload;
    },
    setHover: (_, action) => {
      _.isHover = action.payload;
    },
    setRandom: (_, action) => {
      _.isRandom = action.payload;
    },
  },
});

export const { setHover, setStop, setRandom } = carouselSlice.actions;

export default carouselSlice.reducer;
