import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  graphData: [],
  summary: {},
  range: "monthly",
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateRange: (state, action) => {
      state.range = action.payload;
    },
    setExpenseData: (state, action) => {
      const { trans, graph, summary, range } = action.payload;
      state.transactions = trans;
      state.graphData = graph;
      state.range = range;
      
      // Clean mapping logic
      state.summary = summary.reduce((acc, row) => {
        acc[row.paid_by] = row.spent;
        return acc;
      }, {});
    }
  },
});

export const { setLoading, setError, updateRange, setExpenseData } = expenseSlice.actions;
export default expenseSlice.reducer;