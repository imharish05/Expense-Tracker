import api from "../../api/axios";
import { addStaff,updateStaff,deleteStaff,allStaffs,assignProjectToStaff,unassignProjectFromStaff} from "./staffSlice";
import Swal from "sweetalert2"; // 1. Import SweetAlert


export const allStaffFunction = async(dispatch) => {
    try {
        
        // const res = await api.get("/staffs")

        // const data = res.data.staffs

        // dispatch(allStaffs(data))

    } catch (err) {
        const message = err.response?.data?.message || "Unable To Add Staff";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    }
}

export const addStaffFunction = async(dispatch,payload) => {
    try{
        // const res = await api.post("/add-staff",payload)

        // const data = res.data.staff

        // console.log(payload);
        

        dispatch(addStaff(payload))

        Swal.fire({
            title : "Success!",
            text : "Staff has been added Successfully",
            icon : "success",
            confirmButtonColor : "#ea8b0c",
            timer : 3000
        })

    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Add Staff";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    }
}



export const assignProjectFunction = async (dispatch, staffId, projectId,silent = false) => {
    try {
        // 1. Optional: Backend API Call
        //const res =  await api.post(`/staffs/assign-project`, { staffId, projectId });

        // const data = res.data
        // 2. Update the Redux Store
        dispatch(assignProjectToStaff({ staffId, projectId }));

        // 3. Success Notification
       if (!silent) {
            Swal.fire({
                title: "Assigned!",
                text: "Project successfully assigned",
                icon: "success",
                confirmButtonColor: "#ea8b0c",
                timer: 2000
            });
        }

        return true;
    } catch (err) {
        const message = err.response?.data?.message || "Failed to assign project";

        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
        return false;
    }
};


export const unassignProjectFunction = async (dispatch, staffId, projectId) => {
    try {
        // 1. Optional: Backend API Call
        // await api.post(`/staffs/unassign-project`, { staffId, projectId });

        // 2. Update the Redux Store
        // This should trigger a reducer that filters out the projectId from the staff's project array
        dispatch(unassignProjectFromStaff({ staffId, projectId }));

        // 3. Optional: Sync the Project side as well (Set assignedStaffId to null)
        // dispatch(removeStaffFromProject({ projectId }));

        Swal.fire({
            title: "Unassigned!",
            text: "Project removed from staff member",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });

        return true;
    } catch (err) {
        const message = err.response?.data?.message || "Failed to unassign project";
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
        return false;
    }
};

export const updateStaffFunction = async(dispatch,id,payload) => {
    try{

        // const res = await api.patch('/update-staff/${id}',payload)

        // const data = res.data.staff;

        // console.log(payload);
        
        dispatch(updateStaff(payload))

        Swal.fire({
            title : "Success!",
            text : "Staff record has been updated Successfully",
            icon : "success",
            confirmButtonColor : "#ea8b0c",
            timer : 3000
        })

        return true;

    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Update Staff Record";

        Swal.fire({
            title : "Error!",
            text : message,
            icon :"error",
            confirmButtonColor :"#d33",
        })
    
        return false;
    }
}


export const deleteStaffFunction = async (dispatch, id) => {
    try {
        // await api.delete(`/delete-staff/${id}`);

        dispatch(deleteStaff(id));

        Swal.fire({
            title: "Deleted!",
            text: "Staff record has been removed.",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });

    } catch (err) {
        const message = err.response?.data?.message || "Unable to delete staff record";

        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
};