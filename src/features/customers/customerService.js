import api from "../../api/axios";
import { addCustomer, allCustomers, deleteCustomer, updateCustomer } from "./customerSlice";
import Swal from "sweetalert2"; // 1. Import SweetAlert
import { toast } from "react-hot-toast";


export const addCustomerFunction = async (dispatch, payload) => {
    const promise = api.post("/customers/add-customer", payload);

    toast.promise(promise, {
        loading: 'Saving Customer...',
        success: 'Customer Added!',
        error: (err) => err.response?.data?.message || 'Failed to save',
    });

    try {
        const res = await promise;
        dispatch(addCustomer(res.data.customer)); // Use the data from backend
        return true;
    } catch (err) {
        return false;
    }
};

export const allCustomerFunction = async (dispatch) => {
    // 1. Create a reference for the loading toast
    const loadingToast = toast.loading("Fetching customers...");

    try {
        const res = await api.get("/customers/all"); // Ensure this matches your route
        const data = res.data.customers;

        dispatch(allCustomers(data));

        // 2. Dismiss the loading toast once data is in Redux
        toast.dismiss(loadingToast);

    } catch (err) {
        const message = err.response?.data?.message || "Unable to load customer list";

        // 3. Update the loading toast to an error toast
        toast.error(message, { id: loadingToast });
        
        console.error("Fetch Error:", err);
    }
};

export const updateCustomerFunction = async (dispatch, id, payload) => {
    try {
        const res = await api.patch(`/customers/update-customer/${id}`, payload);
        dispatch(updateCustomer(res.data.customer));
        
        Swal.fire({
            title: "Success!",
            text: "Customer updated successfully",
            icon: "success",
            timer: 2000
        });

        return true;
    } catch (err) {
        return false;
        Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
};

export const deleteCustomerFunction = async (dispatch, id) => {
    try {
        // Added the /customers/ prefix to match your other routes
        await api.delete(`/customers/delete-customer/${id}`);

        dispatch(deleteCustomer(id));

        Swal.fire({
            title : '<span style="font-size: 25px">Deleted! </span>',
            text: "Customer record has been removed.",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });

    } catch (err) {
        const message = err.response?.data?.message || "Unable to delete customer";

        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
};