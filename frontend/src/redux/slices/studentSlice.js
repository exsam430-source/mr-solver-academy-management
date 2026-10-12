import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/students", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/students/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student"
      );
    }
  }
);

export const addStudent = createAsyncThunk(
  "students/add",
  async (studentData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/students", studentData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add student"
      );
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/students/${id}`, studentData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update student"
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/students/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete student"
      );
    }
  }
);
export const addPreviousFees = createAsyncThunk(
  "students/addPreviousFees",
  async ({ id, previousFees }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/students/${id}/previous-fees`, {
        previousFees,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add previous fees"
      );
    }
  }
);

export const fetchStudentFees = createAsyncThunk(
  "students/fetchFees",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/students/${id}/fees`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fees"
      );
    }
  }
);

export const fetchStudentAttendance = createAsyncThunk(
  "students/fetchAttendance",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/students/${id}/attendance`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    selectedStudent: null,
    studentFees: null,
    studentAttendance: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
      state.studentFees = null;
      state.studentAttendance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.unshift(action.payload);
        state.count += 1;
        toast.success("Student added! ✅");
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const i = state.students.findIndex(
          (s) => s._id === action.payload._id
        );
        if (i !== -1) state.students[i] = action.payload;
        toast.success("Student updated! ✅");
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (s) => s._id !== action.payload
        );
        state.count -= 1;
        toast.success("Student deleted! ✅");
      })
      .addCase(deleteStudent.rejected, (_, action) => {
        toast.error(action.payload);
      })
      .addCase(addPreviousFees.fulfilled, (state, action) => {
  toast.success(action.payload.message);
})
.addCase(addPreviousFees.rejected, (_, action) => {
  toast.error(action.payload);
})
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.studentFees = action.payload;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.studentAttendance = action.payload;
      });
  },
});

export const { clearSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;