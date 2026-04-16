import { useMemo } from "react";
import { useSelector } from "react-redux";

export const usePaymentReminders = () => {
  const projects = useSelector((state) => state.projects.projects) || [];
  const allStages = useSelector((state) => state.stages.stage) || [];
  

  return useMemo(() => {
    const overdue = [];
    const unpaidCompleted = [];
    const today = new Date();

    allStages.forEach((projectEntry) => {
      const projectDetails = projects.find(p => (p.id || p._id) === projectEntry.projectId);
      projectEntry.stages.forEach((stage) => {
        const goal = Number(stage.amount) || 0;
        const paid = Number(stage.paid) || 0;
        const isFullyPaid = paid >= goal;
        const hasDeadlinePassed = stage.duration && new Date(stage.duration) < today;


        const reminderData = {
          projectName: projectDetails?.projectName || "Unknown Project",
          projectId: projectEntry.projectId,
          customerName : projectDetails.customerName,
          balance: goal - paid,
          ...stage
        };

        if (hasDeadlinePassed && !isFullyPaid) overdue.push(reminderData);
        if (stage.status === "Completed" && !isFullyPaid) unpaidCompleted.push(reminderData);
      });
    });

    return { overdue, unpaidCompleted, totalCount: overdue.length + unpaidCompleted.length };
  }, [allStages, projects]);
};