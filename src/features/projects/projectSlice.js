import {createSlice } from "@reduxjs/toolkit"
import { updateCustomer } from "../customers/customerSlice"

const initialState = {
    projects : [
        {cost
: 
"1268565",
customerId
: 
1,
customerName
: 
"Kathryn Murphy",
id
: 
"7a36e31a-0e09-4e60-9619-1a2793d0c223",
location
: 
"coimbatore",
projectName : "Sam homes",
projectType: "Residential",
status : "Initialized"}
    ]
}

const projectSlice = createSlice({
    name : "Projects",
    initialState,
    reducers : {
        allProjects : (state,action) => {
            state.projects = action.payload
        },
        addProjects : (state,action) => {
             state.projects.push(action.payload)
        },
        updateProject : (state,action) => {
            const index = state.projects.findIndex(
                (p) => p.id == action.payload.id
            )

            if(!index !== -1){
                state.projects[index] = action.payload
            }
        },
       deleteProject : (state,action) => {
             state.projects = state.projects.filter(
        (p) => p.id != action.payload // Use action.payload directly
    )
}

    }
})


export const {allProjects,addProjects,updateProject,deleteProject} = projectSlice.actions;
export default projectSlice.reducer