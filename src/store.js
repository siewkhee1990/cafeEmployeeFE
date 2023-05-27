import { configureStore } from "@reduxjs/toolkit";
import cafeReducer from "./slices/cafeSlice.js";
import employeeReducer from "./slices/employeeSlice.js";

export default configureStore({
  reducer: { cafe: cafeReducer, employee: employeeReducer },
});
