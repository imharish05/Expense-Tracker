import Swal from "sweetalert2";
import api from "../../api/axios";
import { setStages, addStage, recordStagePayment } from "./stageSlice";

/**
 * Fetch all stages for a specific project
 */
/**
 * Fetch stages for one specific project
 */
export const individualStages = async (dispatch, projectId) => {
    try {
        // GET /stages/project/7a36e31a...
        const res = await api.get(`/stages/project/${projectId}`);
        
        // We dispatch the array of stages directly
        dispatch(setStages(res.data.stages));

    } catch (err) {
        const message = err.response?.data?.message || "Unable to fetch project stages";
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            confirmButtonColor: "#d33",
        });
    }

    // Response 

//     {
//   "projects": [
//     {
//       "projectId": "7a36e31a-0e09-4e60-9619-1a2793d0c223",
//       "stages": [
//         { "id": "1", "stage_Name": "Architecture", "amount": 50000, "paid": 25000 }
//       ]
//     }
//   ]
// }
};

export const addStageFunction = async (dispatch, payload, projectId) => {
    try {
        // const res = await api.post(`/stages/add-stage/${projectId}`, payload);
        
        // We pass an object containing the project ID and the new stage data to the reducer
        // dispatch(addStage({ 
        //     projectId, 
        //     stage: res.data.stage 
        // }));


        dispatch(addStage({
            projectId,
            stage : payload
        }))

        Swal.fire({
            title: "Success!",
            text: "New stage has been added successfully",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });
    } catch (err) {
        const message = err.response?.data?.message || "Unable to add stage";
        Swal.fire({ title: "Error!", text: message, icon: "error", confirmButtonColor: "#d33" });
    }

    // Reponse

//     {
//   "message": "Stage created",
//   "stage": {
//     "id": "2",
//     "stage_Name": "Foundation Work",
//     "description": "Cementing the base",
//     "amount": 150000,
//     "paid": 0,
//     "status": "Pending",
//     "projectId": "7a36e31a-0e09-4e60-9619-1a2793d0c223"
//   }
// }
};

/**
 * Record a payment for a specific stage
 */
export const recordStagePaymentFunction = async (dispatch, payload, stageId, projectId) => {
    try {
        // const res = await api.put(`/stages/record-payment/${stageId}`, payload);
        // const data = res.data.stage;

        // Ensure the reducer knows which project AND which stage to update
        // dispatch(recordStagePayment({ 
        //     projectId,
        //     stageId: data.id, 
        //     paid: data.paid,
        //     status: data.status 
        // }));

         dispatch(recordStagePayment({ 
            projectId,
            stageId: stageId, 
            paid: payload.amount,
            status: "completed" 
        }));

        

        Swal.fire({
            title: "Payment Recorded!",
            text: "The stage balance has been updated.",
            icon: "success",
            confirmButtonColor: "#ea8b0c",
            timer: 2000
        });
    } catch (err) {
        const message = err.response?.data?.message || "Unable to record payment";
        Swal.fire({ title: "Error!", text: message, icon: "error", confirmButtonColor: "#d33" });
    }

    // Response 
//     {
//   "message": "Payment recorded",
//   "stage": {
//     "id": "1",
//     "paid": 35000,
//     "status": "In Progress"
//   }
// }
};