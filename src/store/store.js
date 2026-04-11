import {configureStore} from "@reduxjs/toolkit"
import customerReducer from "../features/customers/customerSlice.js"
import projectReducer from "../features/projects/projectSlice.js"
import staffReducer from "../features/staff/staffSlice.js"
import stageReducer from "../features/stages/stageSlice.js"

export const store = configureStore({
    reducer : {
        customers : customerReducer,
        projects : projectReducer,
        staffs : staffReducer,
        stages : stageReducer
    }
})