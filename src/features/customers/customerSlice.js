import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customers : [],
    totalPages: 1,
    totalItems: 0,
}

const customerSlice = createSlice({
    name : "Customers",
    initialState,
    reducers : {
        allCustomers: (state, action) => {
            // Update the list AND the pagination metadata
            state.customers = action.payload.customers;
            state.totalPages = action.payload.totalPages;
            state.totalItems = action.payload.totalItems;
        },
        addCustomer : (state,action) => {
            state.customers.push(action.payload)
        },
        updateCustomer : (state,action) => {
            const index = state.customers.findIndex(
                (c) => String(c.id)=== String(action.payload.id)
            );
            if(index !== -1){
                state.customers[index] = action.payload;
            }
        },
        deleteCustomer : (state,action) => {
            state.customers = state.customers.filter(
                (c) => String(c.id) !== String(action.payload)
            )
        }
    }
})


export const {addCustomer,updateCustomer,deleteCustomer,allCustomers} = customerSlice.actions;

export default customerSlice.reducer;