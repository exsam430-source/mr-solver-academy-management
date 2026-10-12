import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/attendance", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

export const fetchTodayAttendance = createAsyncThunk(
  "attendance/today",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/attendance/today/${courseId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

export const fetchAttendanceByCourse = createAsyncThunk(
  "attendance/byCourse",
  async ({ courseId, params }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/attendance/course/${courseId}`, {
        params,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

export const markAttendance = createAsyncThunk(
  "attendance/mark",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/attendance", attendanceData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark attendance"
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],
    todayData: null,
    courseAttendance: [],
    count: 0,
    loading: false,
  },
  reducers: {
    clearAttendance: (state) => {
      state.todayData = null;
      state.courseAttendance = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.todayData = action.payload;
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchAttendanceByCourse.fulfilled, (state, action) => {
        state.courseAttendance = action.payload.data;
      })
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAttendance.fulfilled, (state) => {
        state.loading = false;
        toast.success("Attendance marked! ✅");
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      });
  },
});

export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;