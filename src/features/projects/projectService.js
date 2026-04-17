import Swal from "sweetalert2"
import api from "../../api/axios"
import { addProjects, allProjects, assignStaffToProject, deleteProject, removeStaffFromProject, updateProject } from "./projectSlice"
import { deleteStageWithProject } from "../stages/stageService.js";
export const getAllProjects = async(dispatch) => {
    try {
        
        // const res = await api.get("/projects")

        // const data = res.data.projects

        // dispatch(allProjects(data))

        Swal.fire({
                title: '<span style="font-size: 25px">Success!</span>',
                text : "Project has been added Successfully",
                icon : "success",
                confirmButtonColor : "#ea8b0c",
                timer : 3000
            })
    } catch (err) {
        const message = err.response?.data?.message || "Unable To Add Customer";
        
                Swal.fire({
                    title: '<span style="font-size: 25px">Error!</span>',
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
                title: '<span style="font-size: 25px">Success!</span>',
                text : "Project has been added Successfully",
                icon : "success",
                confirmButtonColor : "#ea8b0c",
                timer : 3000
            })

            return true;
    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Add Project";
        
                Swal.fire({
                    title: '<span style="font-size: 25px">Error!</span>',
                    text : message,
                    icon :"error",
                    confirmButtonColor :"#d33",
            })

            return false;
    }
}

export const updateProjectFunction = async(dispatch,id,payload) => {
    try{
        // const res = await api.patch(`/update-project/${id}`,payload)

        // const data = res.data.project

        dispatch(updateProject(payload))

        Swal.fire({
               title: '<span style="font-size: 25px">Success!</span>',
                text : "Project updated Successfully",
                icon : "success",
                confirmButtonColor : "#ea8b0c",
                timer : 3000
            })

            return true;
    }
    catch(err){
        const message = err.response?.data?.message || "Unable To Add Customer";
        
                Swal.fire({
                    title: '<span style="font-size: 25px">Error!</span>',
                    text : message,
                    icon :"error",
                    confirmButtonColor :"#d33",
            })

            return false;
    }
}

export const deleteProjectFunction = async (dispatch, id) => {
    try {
        // const res = await api.delete(`/delete-customer/${id}`);

        dispatch(deleteProject(id));
    
        Swal.fire({
            title: '<span style="font-size: 25px">Deleted!</span>',
            text: "Project record has been removed.",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });

        
    } catch (err) {
        const message = err.response?.data?.message || "Unable to delete customer";

        Swal.fire({
            title: '<span style="font-size: 25px">Error!</span>',
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }
};