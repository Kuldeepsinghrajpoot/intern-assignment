import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./stockSlice"; // Import the stock slice

const store = configureStore({
  reducer: {
    stock: stockReducer, // Add stock reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
