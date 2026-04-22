import api from '../../api/axios.js';
import { updatePaymentReminders } from './notificationSlice.js';

export const fetchPaymentReminders = async (dispatch) => {
    try {
        const res = await api.get('/stages/reminders');
        const reminders = res.data.reminders || [];
        const overdue = reminders.filter(r => r.duration && new Date(r.duration) < new Date() && r.paid < r.amount);
        const unpaidCompleted = reminders.filter(r => r.status === 'Completed' && r.paid < r.amount);
        dispatch(updatePaymentReminders({ overdue, unpaidCompleted }));
    } catch (error) {
        console.error("Failed to fetch reminders:", error);
    }
};