import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

const user = JSON.parse(localStorage.getItem("user") || "null");

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Get Me
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/me");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);

// Get All Teachers
export const fetchTeachers = createAsyncThunk(
  "auth/fetchTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/teachers");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }
);

// Get All Sub-Admins
export const fetchSubAdmins = createAsyncThunk(
  "auth/fetchSubAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/sub-admins");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sub-admins"
      );
    }
  }
);

// Register User (Teacher / Admin / Sub-Admin)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register"
      );
    }
  }
);

// Update User Status (Activate / Deactivate)
export const updateUserStatus = createAsyncThunk(
  "auth/updateStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/auth/users/${id}/status`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/auth/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user || null,
    teachers: [],
    subAdmins: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("selectedBranch");
      toast.success("Logged out successfully!");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.removeItem("selectedBranch");
        toast.success(`Welcome back, ${action.payload.name}! 👋`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })

      // Fetch Teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })

      // Fetch Sub-Admins
      .addCase(fetchSubAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.subAdmins = action.payload;
      })
      .addCase(fetchSubAdmins.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const role = action.payload.role;
        if (role === "teacher") {
          state.teachers.unshift(action.payload);
          toast.success("Teacher added successfully! ✅");
        } else if (role === "sub-admin") {
          state.subAdmins.unshift(action.payload);
          toast.success("Sub-Admin added successfully! ✅");
        } else {
          toast.success("Admin added successfully! ✅");
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })

      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        // Update in teachers list
        const tIdx = state.teachers.findIndex(
          (t) => t._id === action.payload._id
        );
        if (tIdx !== -1) {
          state.teachers[tIdx].isActive = action.payload.isActive;
        }
        // Update in subAdmins list
        const sIdx = state.subAdmins.findIndex(
          (s) => s._id === action.payload._id
        );
        if (sIdx !== -1) {
          state.subAdmins[sIdx].isActive = action.payload.isActive;
        }
        toast.success(
          `User ${action.payload.isActive ? "activated" : "deactivated"} successfully! ✅`
        );
      })
      .addCase(updateUserStatus.rejected, (_, action) => {
        toast.error(action.payload);
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(
          (t) => t._id !== action.payload
        );
        state.subAdmins = state.subAdmins.filter(
          (s) => s._id !== action.payload
        );
        toast.success("User deleted successfully! ✅");
      })
      .addCase(deleteUser.rejected, (_, action) => {
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;