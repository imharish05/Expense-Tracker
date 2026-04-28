import {configureStore} from "@reduxjs/toolkit"
import authSlice from "../features/auth/authSlice.js"
import expenseReducer from '../features/expense/expenseSlice.js';

export const store = configureStore({
    reducer : {
        auth : authSlice,
        expenses: expenseReducer,
    }
})