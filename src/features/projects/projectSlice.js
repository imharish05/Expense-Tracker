import {createSlice, current } from "@reduxjs/toolkit"

const initialState = {
    projects : [],
    totalPages: 1,
    totalItems: 0
}

const projectSlice = createSlice({
    name : "Projects",
    initialState,
    reducers : {
       allProjects: (state, action) => {
    state.projects = action.payload.projects;
    state.totalPages = action.payload.totalPages;
    state.totalItems = action.payload.totalItems;
},
        addProjects : (state,action) => {
             state.projects.push(action.payload)
        },
        updateProject : (state,action) => {
            const index = state.projects.findIndex(
                (p) => String(p.id) === String(action.payload.id)
            )

            if(!index !== -1){
                state.projects[index] = action.payload
            }
        },
       deleteProject : (state,action) => {
             state.projects = state.projects.filter(
        (p) => String(p.id)!== String(action.payload) // Use action.payload directly
        )},

        assignStaffToProject : (state,action) => {
            const {projectId,staffId,staffName} = action.payload;

            const project  = state.projects.find((p)=> String(p.id) === String(projectId))
            
            if (project) {
                project.assignedStaffId = staffId;
                project.assignedStaffName = staffName;
            }
        },
        unAssignStaffFromProject : (state,action) => {
            const {projectId} = action.payload;

            const project = state.projects.find((p)=> String(p.id) === String(projectId))

            if(project){
                project.assignedStaffId = null;
                project.assignedStaffName = null;
            }
        }
    }
})


export const {allProjects,addProjects,updateProject,deleteProject,unAssignStaffFromProject,assignStaffToProject} = projectSlice.actions;
export default projectSlice.reducer