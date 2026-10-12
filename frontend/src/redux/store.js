import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import studentReducer from "./slices/studentSlice.js";
import courseReducer from "./slices/courseSlice.js";
import feeReducer from "./slices/feeSlice.js";
import attendanceReducer from "./slices/attendanceSlice.js";
import branchReducer from "./slices/branchSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    courses: courseReducer,
    fees: feeReducer,
    attendance: attendanceReducer,
    branches: branchReducer,
  },
});

export default store;