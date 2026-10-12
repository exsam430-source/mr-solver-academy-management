import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export const fetchBranches = createAsyncThunk(
  "branches/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/branches");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch branches"
      );
    }
  }
);

export const createBranch = createAsyncThunk(
  "branches/create",
  async (branchData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/branches", branchData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create branch"
      );
    }
  }
);

export const updateBranch = createAsyncThunk(
  "branches/update",
  async ({ id, branchData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/branches/${id}`, branchData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update branch"
      );
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "branches/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/branches/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete branch"
      );
    }
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState: {
    branches: [],
    // For sub-admin: selectedBranch is always their assignedBranch
    // For admin: selectedBranch comes from localStorage
    selectedBranch: JSON.parse(localStorage.getItem("selectedBranch") || "null"),
    loading: false,
  },
  reducers: {
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
      localStorage.setItem("selectedBranch", JSON.stringify(action.payload));
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
      localStorage.removeItem("selectedBranch");
    },
    // Called after sub-admin login to set their branch as selected
    setSubAdminBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload.data;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.unshift(action.payload);
        toast.success("Branch created! ✅");
      })
      .addCase(createBranch.rejected, (_, action) => {
        toast.error(action.payload);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const i = state.branches.findIndex((b) => b._id === action.payload._id);
        if (i !== -1) state.branches[i] = action.payload;
        toast.success("Branch updated! ✅");
      })
      .addCase(updateBranch.rejected, (_, action) => {
        toast.error(action.payload);
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter((b) => b._id !== action.payload);
        toast.success("Branch deleted! ✅");
      })
      .addCase(deleteBranch.rejected, (_, action) => {
        toast.error(action.payload);
      });
  },
});

export const { setSelectedBranch, clearSelectedBranch, setSubAdminBranch } =
  branchSlice.actions;
export default branchSlice.reducer;