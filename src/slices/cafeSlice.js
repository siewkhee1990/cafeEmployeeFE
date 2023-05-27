import { createSlice } from "@reduxjs/toolkit";

export const cafe = createSlice({
  name: "cafe",
  initialState: {
    cafeList: null,
    editData: null,
  },
  reducers: {
    setCafeList: (state, event) => {
      const { payload } = event;
      state.cafeList = payload;
    },
    setEditCafe: (state, event) => {
      const { payload } = event;
      console.log(payload);
    },
    removeEditCafe: (state) => {
      state.editData = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCafeList, setEditCafe, removeEditCafe } = cafe.actions;

export default cafe.reducer;
