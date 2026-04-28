import api from "../../api/axios";
import { setExpenseData, setLoading, setError } from "./expenseSlice";

// Basic API calls
const getTransactions = () => api.get("/expenses/transactions").then(res => res.data);
const getGraphData = (range) => api.get(`/expenses/graph?range=${range}`).then(res => res.data);
const getSummary = () => api.get("/expenses/summary").then(res => res.data);
const addTransaction = (data) => api.post("/expenses/transactions", data);

// The "Service Function" that coordinates everything
export const fetchAllExpenseData = (range) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const [trans, graph, summary] = await Promise.all([
      getTransactions(),
      getGraphData(range),
      getSummary()
    ]);

    dispatch(setExpenseData({ trans, graph, summary, range }));
  } catch (error) {
    dispatch(setError(error.response?.data?.error || "Failed to fetch expenses"));
  } finally {
    dispatch(setLoading(false));
  }
};

// Function to add and then auto-refresh
export const createExpense = (formData) => async (dispatch, getState) => {
  try {
    await addTransaction(formData);
    const currentRange = getState().expenses.range;
    dispatch(fetchAllExpenseData(currentRange)); // Auto-refresh
  } catch (error) {
    console.error("Creation failed", error);
  }
};