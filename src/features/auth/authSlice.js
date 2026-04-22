import { createSlice } from "@reduxjs/toolkit"; // NOT 'react-redux'

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    user: storedUser,
    token: storedToken,
    isAuthenticated: !!storedToken, // If token exists, assume true for now
    loading: false,
    isInitialized: false, // Add this to track if the first load check is done
    error: null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        loginStart : (state) => {
            state.loading = true;
            state.error = null;
        },

        
        loginSuccess: (state, action) => {
          state.isInitialized = true;
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;

  // Save both!
  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
},
logout: (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Clean up both!
},
        loginFailure : (state,action) => {
          state.isInitialized = true;
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
    }
})


export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions
export default authSlice.reducer;