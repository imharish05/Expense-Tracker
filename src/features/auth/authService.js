import api from "../../api/axios";
import { loginStart, loginSuccess, loginFailure } from "./authSlice";
import toast from 'react-hot-toast'; // Import toast

export const loginFunction = async (dispatch, navigate, { phone, password }) => {
    dispatch(loginStart());

    // Create a loading toast that we will update later
    const loadToast = toast.loading('Logging in...');

    try {
        const res = await api.post("/auth/login", { phone, password });

        dispatch(loginSuccess(res.data));

        // Update the existing toast to success
        toast.success(`Welcome back, ${res.data.user.name}!`, {
            id: loadToast,
        });

        navigate("/");

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Login failed";
        
        // Update the existing toast to error
        toast.error(errorMessage, {
            id: loadToast,
        });

        // Ensure you have a failure action to stop the loading state in Redux
        if (typeof loginFailure === 'function') {
            dispatch(loginFailure(errorMessage));
        }
    }
};