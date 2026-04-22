import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  staffs: [],
  totalPages : 1,
  totalItems : 0
};

const staffSlice = createSlice({
    name : "Staffs",
    initialState,
    reducers : {
        allStaffs: (state, action) => {
      // Map through incoming staffs and parse the projects string if it exists
      state.staffs = action.payload.staffs.map((staff) => ({
        ...staff,
        projects: typeof staff.projects === 'string' 
          ? JSON.parse(staff.projects) 
          : (staff.projects || [])
      }));
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
    },

    updateStaff: (state, action) => {
      const index = state.staffs.findIndex(
        (s) => String(s.id) === String(action.payload.id)
      );

      if (index !== -1) {
        // Also parse the projects for single updates
        const updatedStaff = {
          ...action.payload,
          projects: typeof action.payload.projects === 'string' 
            ? JSON.parse(action.payload.projects) 
            : (action.payload.projects || [])
        };
        state.staffs[index] = { ...state.staffs[index], ...updatedStaff };
      }
    },
        addStaff : (state,action) => {
            state.staffs.push(action.payload)
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