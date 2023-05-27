import { createSlice } from "@reduxjs/toolkit";

export const employee = createSlice({
  name: "employee",
  initialState: {
    employeeList: null,
    editData: null,
  },
  reducers: {
    setEmployeeList: (state, event) => {
      const { payload } = event;
      state.employeeList = payload;
    },
    setEditEmployee: (state, event) => {
      const { payload } = event;
      state.editData = payload;
    },
    removeEditEmployee: (state) => {
      state.editData = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEmployeeList, setEditEmployee, removeEditEmployee } =
  employee.actions;

export default employee.reducer;
