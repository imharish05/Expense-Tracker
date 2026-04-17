import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    customers : []
}

const customerSlice = createSlice({
    name : "Customers",
    initialState,
    reducers : {
        allCustomers : (state,action) => {
            state.customers = action.payload;
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