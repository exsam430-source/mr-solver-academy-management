import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/courses");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

export const addCourse = createAsyncThunk(
  "courses/add",
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/courses", courseData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add course"
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/update",
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/courses/${id}`, courseData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update course"
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/courses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete course"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
        state.count += 1;
        toast.success("Course added successfully! ✅");
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.courses[index] = action.payload;
        toast.success("Course updated! ✅");
      })
      .addCase(updateCourse.rejected, (_, action) => {
        toast.error(action.payload);
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
        state.count -= 1;
        toast.success("Course deleted! ✅");
      })
      .addCase(deleteCourse.rejected, (_, action) => {
        toast.error(action.payload);
      });
  },
});

export default courseSlice.reducer;