import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000/api/stocks";

// ✅ Fetch all stocks (GET request)
export const fetchStocks = createAsyncThunk(
  "stock/fetchStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to fetch stocks");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch stock data with stock ID and duration (POST request)
export const fetchStockWithDuration = createAsyncThunk(
  "stock/fetchStockWithDuration",
  async (
    { stockId, duration }: { stockId: string; duration: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${stockId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to fetch stock data");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Define Stock State Type
interface StockState {
  stocks: any[]; // Change `any[]` to a proper Stock type if available
  stockData: any | null;
  loadingStocks: boolean;
  loadingStockData: boolean;
  errorStocks: string | null;
  errorStockData: string | null;
}

// ✅ Initial state
const initialState: StockState = {
  stocks: [],
  stockData: null,
  loadingStocks: false,
  loadingStockData: false,
  errorStocks: null,
  errorStockData: null,
};

// ✅ Create Redux slice
const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    resetStockData: (state) => {
      state.stockData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Handle fetchStocks (GET request)
      .addCase(fetchStocks.pending, (state) => {
        state.loadingStocks = true;
        state.errorStocks = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loadingStocks = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loadingStocks = false;
        state.errorStocks = action.payload as string;
      })

      // ✅ Handle fetchStockWithDuration (POST request)
      .addCase(fetchStockWithDuration.pending, (state) => {
        state.loadingStockData = true;
        state.errorStockData = null;
      })
      .addCase(fetchStockWithDuration.fulfilled, (state, action) => {
        state.loadingStockData = false;
        state.stockData = action.payload;
      })
      .addCase(fetchStockWithDuration.rejected, (state, action) => {
        state.loadingStockData = false;
        state.errorStockData = action.payload as string;
      });
  },
});

export const { resetStockData } = stockSlice.actions;
export default stockSlice.reducer;