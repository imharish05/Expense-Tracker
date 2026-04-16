
import api from "../../api/axios";
import { 
    allRecords,
  recordPaymentStart, 
  recordPaymentSuccess, 
  recordPaymentFailure 
} from "./paymentSlice";
import Swal from "sweetalert2";

// Replace with your actual API base URL
const API_URL = "/api/payments"; 

// export const allPaymentRecords = async(dispatch) => {
//     try {
//         const res = await api.get("/payments")
//         const data = res.data;
//         dispatch(allRecords(data))

//     } catch (err) {
        
//     }
// }

export const stagePaymentCollection = async (dispatch, paymentData, stageId, projectId) => {
    dispatch(recordPaymentStart());
    try {
        const payload = {
        
    projectId,
      stageId,
      budget : paymentData.budget,
      stage_amount : paymentData.stage_amount,
      amount: paymentData.amount,
      paymentMode: paymentData.payment_mode,
      paymentDate: paymentData.payment_date,
      status: paymentData.payment_status,
      customerId: paymentData.customerId,
      customerName: paymentData.customerName,
      projectName: paymentData.projectName,
    };
    
    // const response = await axios.post(`${API_URL}/record`, payload);

    // if (response.data) {
    //   dispatch(recordPaymentSuccess(response.data));
      
    //   Swal.fire({
    //     icon: "success",
    //     title: "Payment Recorded",
    //     text: `Amount: ₹${paymentData.amount} processed successfully.`,
    //     timer: 2000,
    //     showConfirmButton: false,
    //   });
// }

    dispatch(recordPaymentSuccess(payload))
      return true;
    }
  catch (error) {
    const message = error.response?.data?.message || "Failed to record payment";
    dispatch(recordPaymentFailure(message));
    
    Swal.fire({
      icon: "error",
      title: "Payment Error",
      text: message,
    });
    return false;
  }
};