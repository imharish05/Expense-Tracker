import { createSlice } from "@reduxjs/toolkit"; // NOT 'react-redux'
// const initialState = {
//     user : null,
//     token : null,
//     isAuthenticated : false,
//     loading : false,
//     error : null
// }

const initialState = {
    "success": true,
    "isAuthenticated" : true,
  "token": "sample Token", 
  "user": {
    "id": "1",
    "name": "Harish",
    "email": "sample@gmail.com",
    "role": "staff",
"permissions" :[
  "view-admin",
  "view-dashboard",
  "change-status",
  "view-staffs",
  "create-staff",
  "edit-staff",
  "delete-staff",
  "view-customers",
  "create-customer",
  "edit-customer",
  "delete-customer",
  "view-projects",
  "create-projects",
  "edit-projects",
  "delete-projects",
  "upload-docs",
  "manage-access",
  "manage-remainders",
  "view-reports"
]
  }
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        loginStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess : (state,action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem("token",action.payload.token)
        },
        loginFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout : (state) => {
            state.loading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token")
        }
    }
})


export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions
export default authSlice.reducer;