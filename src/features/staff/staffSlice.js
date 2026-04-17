import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  staffs: []
};

const staffSlice = createSlice({
    name : "Staffs",
    initialState,
    reducers : {
        allStaffs : (state,action) => {
            state.staffs = action.payload;
        },
        addStaff : (state,action) => {
            state.staffs.push(action.payload)
        },
        updateStaff: (state, action) => {
    // Find the specific staff member in your local array
    const index = state.staffs.findIndex(
        (s) => String(s.id) === String(action.payload.id)
    );

    if (index !== -1) {
        // Replace the old staff data with the new data from the backend
        // This triggers React to re-render only the affected parts of the UI
        state.staffs[index] = { ...state.staffs[index], ...action.payload };
    }
},
        deleteStaff : (state,action) => {
            state.staffs = state.staffs.filter(
                (c) => String(c.id) !== String(action.payload)
            )
        },
        assignProjectToStaff: (state, action) => {
            const { staffId, projectId } = action.payload;

            const staff = state.staffs.find((s) => String(s.id) === String(staffId));

            if (staff) {
                if (!staff.projects) staff.projects = [];
                if (!staff.projects.includes(projectId)) staff.projects.push(projectId);
            }
        },
        unAssignProjectFromStaff : (state,action) => {
            const {staffId,projectId} = action.payload;

            const staff = state.staffs.find((s) =>String(s.id) === String(staffId))

            if(staff && staff.projects){
                staff.projects = staff.projects.filter((p) => String(p.id) !== String(projectId))
            }
        }
    }
})


export const {addStaff,updateStaff,deleteStaff,allStaffs,assignProjectToStaff,unAssignProjectFromStaff} = staffSlice.actions;

export default staffSlice.reducer;