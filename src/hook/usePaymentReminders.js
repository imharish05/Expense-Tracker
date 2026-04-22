// usePaymentReminders.js
import { useMemo } from "react";
import { useSelector } from "react-redux";


// usePaymentReminders.js
export const usePaymentReminders = (socketNotifications = []) => {
  const projects = useSelector((state) => state.projects.projects) || [];
  const allStages = useSelector((state) => state.stages.stage) || [];

  return useMemo(() => {
    // 1. Calculate Active Socket Notifications first
    // This ensures even if projects aren't loaded, we show the socket alerts
    const activeSocketNotifications = socketNotifications.filter(note => {
      if (allStages.length === 0) return true; // Keep them if stages aren't loaded yet
      const relatedStage = allStages.find(s => s.projectId === note.projectId);
      if (!relatedStage) return true;
      return Number(relatedStage.paid) < Number(relatedStage.amount);
    });

    const overdue = [];
    const unpaidCompleted = [];
    const today = new Date();

    // 2. Only process stages if they exist
    if (allStages.length > 0) {
      allStages.forEach((stage) => {
        const projectDetails = projects.find(p => (p.id || p._id) === stage.projectId);
        const isFullyPaid = Number(stage.paid) >= Number(stage.amount);

        if (!isFullyPaid) {
          const reminderData = { 
            projectName: projectDetails?.projectName || "Unknown Project", 
            ...stage 
          };
          if (stage.duration && new Date(stage.duration) < today) overdue.push(reminderData);
          if (stage.status === "Completed") unpaidCompleted.push(reminderData);
        }
      });
    }

    console.log( activeSocketNotifications.length ,"This is the total count");
    

    // 3. Return the combined count
    return { 
      overdue, 
      unpaidCompleted, 
      socketNotifications: activeSocketNotifications,
      totalCount: overdue.length + unpaidCompleted.length + activeSocketNotifications.length 
    };
    // Ensure all dependencies are here
  }, [allStages, projects, socketNotifications]);
};