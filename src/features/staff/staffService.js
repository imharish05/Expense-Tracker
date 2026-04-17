import api from "../../api/axios";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast"; // 1. Import toast
import { 
    addStaff, updateStaff, deleteStaff, allStaffs, 
    assignProjectToStaff, unAssignProjectFromStaff 
} from "./staffSlice";
import { assignStaffToProject, unAssignStaffFromProject } from "../projects/projectSlice";

export const addStaffFunction = async (dispatch, payload) => {
    // 2. Use toast.promise for automated loading/success/error states
    const promise = api.post("/staffs/add-staff", payload);

    toast.promise(promise, {
        loading: 'Adding staff...',
        success: 'Staff added successfully!',
        error: (err) => err.response?.data?.message || 'Failed to add staff',
    });

    try {
        const res = await promise;
        dispatch(addStaff(res.data.staff));
        return true;
    } catch (err) {
        return false;
    }
};

export const allStaffFunction = async (dispatch) => {
    try {
        const res = await api.get("/staffs/all");
        dispatch(allStaffs(res.data.staffs));
    } catch (err) { 
        toast.error("Could not fetch staff list");
        console.log(err); 
    }
};

export const updateStaffFunction = async (dispatch, id, payload) => {
    const loadingToast = toast.loading("Updating details...");
    
    try {
        const res = await api.patch(`/staffs/update/${id}`, payload);
        dispatch(updateStaff(res.data.staff)); 
        toast.success("Staff updated!", { id: loadingToast });
        return true;
    } catch (err) { 
        toast.error("Update failed", { id: loadingToast });
        console.error("Update failed:", err);
        return false; 
    }
};

export const deleteStaffFunction = async (dispatch, id) => {
    // Usually, delete is preceded by a SweetAlert confirmation, 
    // so we just show the result toast here.
    try {
        await api.delete(`/staffs/delete/${id}`);
        dispatch(deleteStaff(id));
        toast.success("Staff deleted");
    } catch (err) { 
        toast.error("Delete failed");
        console.log(err); 
    }
};