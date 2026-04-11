import {configureStore} from "@reduxjs/toolkit"
import customerReducer from "../features/customers/customerSlice.js"
import projectReducer from "../features/projects/projectSlice.js"

export const store = configureStore({
    reducer : {
        customers : customerReducer,
        projects : projectReducer,
    }
})