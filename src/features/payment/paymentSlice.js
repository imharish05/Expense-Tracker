import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  isLoading: false,
  isError: false,
  message: "",
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    allRecords: (state, action) => {
    state.payments = action.payload; 
    state.isLoading = false;
},
    recordPaymentStart: (state) => {
      state.isLoading = true;
    },
    recordPaymentSuccess: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      // Adds the new payment to the list
      state.payments.push(action.payload);
    },
    recordPaymentFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    },
    resetPaymentState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    }
  },
});

export const { 
    allRecords,
  recordPaymentStart, 
  recordPaymentSuccess, 
  recordPaymentFailure,
  resetPaymentState 
} = paymentSlice.actions;

export default paymentSlice.reducer;
