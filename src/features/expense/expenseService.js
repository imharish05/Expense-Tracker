import toast from "react-hot-toast";
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

// Unified Delete Service
// Unified Delete Service
export const deleteEntry = (id, type) => async (dispatch, getState) => {
    // 1. Define the promise (the actual API call)
    const url = type === "INCOMING" ? `/treasury/log/${id}` : `/expenses/${id}`;
    const deletePromise = api.delete(url);

    // 2. Wrap the promise in a toast
    toast.promise(deletePromise, {
        loading: 'Deleting entry...',
        success: 'Entry deleted successfully!',
        error: (err) => err.response?.data?.error || 'Delete failed',
    });

    try {
        await deletePromise;
        
        // Refresh all data to ensure balances and lists are in sync
        const currentRange = getState().expenses.range;
        dispatch(fetchAllExpenseData(currentRange));
    } catch (error) {
        console.error("Delete operation failed", error);
    }
};

// Unified Update Service
export const updateEntry = (id, type, data) => async (dispatch, getState) => {
    // 1. Define the promise
    const url = type === "INCOMING" ? `/treasury/log/${id}` : `/expenses/${id}`;
    const updatePromise = api.put(url, data);

    // 2. Wrap the promise in a toast
    toast.promise(updatePromise, {
        loading: 'Updating entry...',
        success: 'Entry updated successfully!',
        error: (err) => err.response?.data?.error || 'Update failed',
    });

    try {
        await updatePromise;
        
        const currentRange = getState().expenses.range;
        dispatch(fetchAllExpenseData(currentRange));
    } catch (error) {
        console.error("Update operation failed", error);
    }
};