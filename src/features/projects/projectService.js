import Swal from "sweetalert2"
import api from "../../api/axios"
import { addProjects, allProjects, assignStaffToProject, deleteProject, removeStaffFromProject, updateProject } from "./projectSlice"

export const getAllProjects = async(dispatch) => {
    try {
        
        // const res = await api.get("/projects")

        // const data = res.data.projects

        // dispatch(allProjects(data))

        Swal.fire({
                title : "Success!",
                text : "Project has been added Successfully",
                icon : "success",
                confirmButtonColor : "#ea8b0c",
                timer : 3000
            })
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


export const addNewProject = async(dispatch,payload) => {
    try{
        // const res = await api.post("/add-project",payload)

        // const data = res.data.project

        dispatch(addProjects(payload))

        Swal.fire({
                title : "Success!",
                text : "Project has been added Successfully",
                icon : "success",
                confirmButtonColor : "#ea8b0c",
                timer : 3000
            })
    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Add Project";
        
                Swal.fire({
                    title : "Error!",
                    text : message,
                    icon :"error",
                    confirmButtonColor :"#d33",
            })
    }
}

export const updateProjectFunction = async(dispatch,id,payload) => {
    try{
        // const res = await api.patch(`/update-project/${id}`,payload)

        // const data = res.data.project

        dispatch(updateProject(payload))

        Swal.fire({
                title : "Success!",
                text : "Project updated Successfully",
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

export const deleteProjectFunction = async (dispatch, id) => {
    try {
        // const res = await api.delete(`/delete-customer/${id}`);

        dispatch(deleteProject(id));

        Swal.fire({
            title: "Deleted!",
            text: "Project record has been removed.",
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

export const assignStaffToProjectFunction = async (dispatch, projectId, staffId, staffName) => {
    try {
        // 1. Update backend (Assumes a junction table or FK update)
        // await api.post(`/projects/assign-staff`, { projectId, staffId });

        // 2. Update Redux store using the specific reducer you created
        // dispatch(assignStaffToProject({ projectId, staffId, staffName }));

        dispatch(assignStaffToProject({projectId, staffId, staffName}))

        Swal.fire({
            title: "Assigned!",
            text: `${staffName} has been assigned to the project.`,
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });

        return true;

    } catch (err) {
        const message = err.response?.data?.message || "Assignment failed";
        Swal.fire({ title: "Error!", text: message, icon: "error", confirmButtonColor: "#d33" });

        return false;
    }
};


export const unAssignStaffFromProjectFunction = async (dispatch, projectId, staffId, staffName, silent = false) => {
    try {
        // 1. Optional: Backend API Call
        // await api.delete(`/projects/unassign-staff/${projectId}`);

        // 2. Update Redux store
        dispatch(removeStaffFromProject({ projectId }));
        

        // 3. Notification (only if not silent)
        if (!silent) {
            Swal.fire({
                title: "Removed!",
                text: `${staffName} has been removed from the project.`,
                icon: "success",
                confirmButtonColor: "#ea8b0c",
                timer: 2000
            });
        }

        return true;
    } catch (err) {
        const message = err.response?.data?.message || "Unassignment failed";
        Swal.fire({ title: "Error!", text: message, icon: "error", confirmButtonColor: "#d33" });
        return false;
    }
};
