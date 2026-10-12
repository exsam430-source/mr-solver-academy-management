import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js";
import toast from "react-hot-toast";

export const fetchFees = createAsyncThunk(
  "fees/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/fees", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch fees"
      );
    }
  }
);

export const fetchFeeSummary = createAsyncThunk(
  "fees/summary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/fees/summary");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary"
      );
    }
  }
);

export const fetchPendingFees = createAsyncThunk(
  "fees/pending",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/fees/pending", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending"
      );
    }
  }
);

export const fetchStudentFeeDetails = createAsyncThunk(
  "fees/studentDetails",
  async (studentId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/fees/student/${studentId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student fees"
      );
    }
  }
);

export const fetchMonthlyReport = createAsyncThunk(
  "fees/monthlyReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/fees/monthly-report", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

export const addFee = createAsyncThunk(
  "fees/add",
  async (feeData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/fees", feeData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add fee"
      );
    }
  }
);

export const deleteFee = createAsyncThunk(
  "fees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/fees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete fee"
      );
    }
  }
);

const feeSlice = createSlice({
  name: "fees",
  initialState: {
    fees: [],
    pendingFees: [],
    studentFeeDetails: null,
    monthlyReport: null,
    summary: null,
    count: 0,
    totalAmount: 0,
    pendingCount: 0,
    pendingTotalDue: 0,
    lastAddedFee: null,
    loading: false,
  },
  reducers: {
    clearLastFee: (state) => {
      state.lastAddedFee = null;
    },
    clearStudentFeeDetails: (state) => {
      state.studentFeeDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload.data;
        state.count = action.payload.count;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchFeeSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      .addCase(fetchPendingFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingFees.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingFees = action.payload.data;
        state.pendingCount = action.payload.count;
        state.pendingTotalDue = action.payload.totalDue;
      })
      .addCase(fetchPendingFees.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchStudentFeeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentFeeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFeeDetails = action.payload;
      })
      .addCase(fetchStudentFeeDetails.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyReport = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(addFee.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees.unshift(action.payload);
        state.count += 1;
        state.lastAddedFee = action.payload;
        toast.success("Fee recorded! ✅");
      })
      .addCase(addFee.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
      })
      .addCase(deleteFee.fulfilled, (state, action) => {
        state.fees = state.fees.filter((f) => f._id !== action.payload);
        state.count -= 1;
        toast.success("Fee deleted! ✅");
      })
      .addCase(deleteFee.rejected, (_, action) => {
        toast.error(action.payload);
      });
  },
});

export const { clearLastFee, clearStudentFeeDetails } = feeSlice.actions;
export default feeSlice.reducer;