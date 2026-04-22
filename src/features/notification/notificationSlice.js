import { createSlice } from '@reduxjs/toolkit';

const persistedReminders = JSON.parse(localStorage.getItem('paymentReminders') || '{"overdue": [], "unpaidCompleted": []}');

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        paymentReminders: persistedReminders,
        totalCount: persistedReminders.overdue.length + persistedReminders.unpaidCompleted.length,
    },
    reducers: {
        updatePaymentReminders: (state, action) => {
            state.paymentReminders = action.payload;
            state.totalCount = action.payload.overdue.length + action.payload.unpaidCompleted.length;
            localStorage.setItem('paymentReminders', JSON.stringify(action.payload));
        },
        clearNotifications: (state) => {
            state.paymentReminders = { overdue: [], unpaidCompleted: [] };
            state.totalCount = 0;
            localStorage.removeItem('paymentReminders');
        },
    },
});

export const { updatePaymentReminders, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;