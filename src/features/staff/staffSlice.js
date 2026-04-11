import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    staffs : [
      {
        id: 1,
        name: "Harish",
        address: "12, MG Road, T. Nagar, Chennai, Tamil Nadu - 600017",
        phone: "9876543210",
        projectId : [""],
        status: "Active",
      },
      {
        id: 2,
        name: "Sam",
        address: "12, MG Road, T. Nagar, Chennai, Tamil Nadu - 600017",
        phone: "9876543210",
        projectId : [""],
        status: "Active",
      }
    ]
}

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
        updateStaff : (state,action) => {
            const index = state.staffs.findIndex(
                (c) => c.id == action.payload.id
            );
            if(index !== -1){
                state.staffs[index] = action.payload;
            }
        },
        deleteStaff : (state,action) => {
            state.staffs = state.staffs.filter(
                (c) => c.id != action.payload
            )
        },
        assignProjectToStaff: (state, action) => {
            const { staffId, projectId } = action.payload;
            const staff = state.staffs.find((s) => s.id == staffId);
            
            if (staff) {
                // Initialize array if it doesn't exist
                if (!staff.projectId) {
                    staff.projectId = [];
                }
                // Only add if the project isn't already assigned
                if (!staff.projectId.includes(projectId)) {
                    staff.projectId.push(projectId);
                }
            }
        },
        unassignProjectFromStaff: (state, action) => {
        const { staffId, projectId } = action.payload;
        const staff = state.staffs.find((s) => String(s.id) === String(staffId));
    
        if (staff && staff.projects) {
        // Remove the specific project ID from the array
        staff.projects = staff.projects.filter((id) => String(id) !== String(projectId));
    }
},
    }
})


export const {addStaff,updateStaff,deleteStaff,allStaffs,assignProjectToStaff,unassignProjectFromStaff} = staffSlice.actions;

export default staffSlice.reducer;