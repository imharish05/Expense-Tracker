import api from "../../api/axios";
import { addCustomer, allCustomers, deleteCustomer, updateCustomer } from "./customerSlice";
import Swal from "sweetalert2"; // 1. Import SweetAlert


export const allCustomerFunction = async(dispatch) => {
    try {
        
        // const res = await api.get("/customers")

        // const data = res.data.customers

        // dispatch(allCustomers(data))

    } catch (err) {
        const message = err.response?.data?.message || "Unable To Add Customer";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    }
}

export const addCustomerFunction = async(dispatch,payload) => {
    try{
        // const res = await api.post("/add-customer",payload)

        // const data = res.data.customer

        console.log(payload);
        

        dispatch(addCustomer(payload))

        Swal.fire({
            title : '<span style="font-size: 25px">Success! </span>',
            text : "Customer has been added Successfully",
            icon : "success",
            confirmButtonColor : "#ea8b0c",
            timer : 3000
        })

    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Add Customer";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    }
}

export const updateCustomerFunction = async(dispatch,id,payload) => {
    try{

        // const res = await api.patch('/update-customer/${id}',payload)

        // const data = res.data.customer;

        console.log(payload);
        

        dispatch(updateCustomer(payload))
        

        Swal.fire({
            title : '<span style="font-size: 25px">Success! </span>',
            text : "Customer has been updated Successfully",
            icon : "success",
            confirmButtonColor : "#ea8b0c",
            timer : 3000
        })

    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Update Customer";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    }
}


export const deleteCustomerFunction = async (dispatch, id) => {
    try {
        // await api.delete(`/delete-customer/${id}`);

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