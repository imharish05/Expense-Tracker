import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const ProjectReminders = () => {
  const projects = useSelector((state) => state.projects.projects) || [];
  const allStages = useSelector((state) => state.stages.stage) || [];

  const paymentReminders = useMemo(() => {
    const overduePayments = [];
    const unpaidCompletedStages = [];
    const today = new Date();

    allStages.forEach((projectEntry) => {
      const projectDetails = projects.find(p => (p.id || p._id) === projectEntry.projectId);
      
      projectEntry.stages.forEach((stage) => {
        const goal = Number(stage.amount) || 0;
        const paid = Number(stage.paid) || 0;
        const isFullyPaid = paid >= goal;
        const hasDeadlinePassed = stage.duration && new Date(stage.duration) < today;

        // Condition 1: Payment due date crossed and not fully paid
        if (hasDeadlinePassed && !isFullyPaid) {
          overduePayments.push({
            projectName: projectDetails?.projectName || "Unknown Project",
            projectId: projectEntry.projectId,
            customerName: projectDetails.customerName,
            balance: goal - paid,
            dueDate: stage.duration,
            ...stage
          });
        }

        // Condition 2: Stage completed but unpaid (balance exists)
        // This targets stages work-wise "Completed" but financially pending
        if (stage.status === "Completed" && !isFullyPaid) {
          unpaidCompletedStages.push({
            projectName: projectDetails?.projectName || "Unknown Project",
            projectId: projectEntry.projectId,
            customerName: projectDetails.customerName,
            balance: goal - paid,
            ...stage
          });
        }
      });
    });

    return { overduePayments, unpaidCompletedStages };
  }, [allStages, projects]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-24">
      <div className="d-flex align-items-center gap-2 mb-24">
        <Icon icon="solar:hand-money-bold-duotone" className="text-danger-600 display-6" />
        <h4 className="mb-0">Payment Reminders</h4>
      </div>

      <div className="row gy-4">
        {/* Condition 1: Overdue Payments */}
        <div className="col-xl-6">
          <div className="card h-100 radius-12 border-0 shadow-sm">
            <div className="card-header bg-base border-bottom p-20">
              <h6 className="mb-0 d-flex align-items-center gap-2 text-danger-main">
                <Icon icon="solar:danger-bold" />
                Overdue Payments (Date Crossed)
              </h6>
            </div>
            <div className="card-body p-20">
              {paymentReminders.overduePayments.length > 0 ? (
                paymentReminders.overduePayments.map((item, i) => (
                  <div 
  key={i} 
  className="d-flex align-items-center justify-content-between p-12 mb-12 radius-8 border border-danger-main bg-neutral-50"
>
                    <div>
                      <p className="text-xs text-primary-600 fw-bold mb-1 uppercase">{item.projectName}</p>
                      <h6 className="text-sm mb-1">{item.stage_Name}</h6>
                      <h6 className="text-xs mb-1">{item.customerName}</h6>
                      <p className="text-xs fw-bold text-danger-main mb-0">
                        Pending: {formatCurrency(item.balance)}
                      </p>
                      <small className="text-secondary-light">Due Date: {new Date(item.dueDate).toLocaleDateString()}</small>
                    </div>
                    <Link to={`/projects/${item.projectId}`} className="btn btn-danger-600 btn-xs radius-4 text-white">Collect</Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary-light py-20">No overdue payments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Condition 2: Completed but Unpaid */}
        <div className="col-xl-6">
          <div className="card h-100 radius-12 border-0 shadow-sm">
            <div className="card-header bg-base border-bottom p-20">
              <h6 className="mb-0 d-flex align-items-center gap-2 text-warning-main">
                <Icon icon="solar:check-read-bold" />
                Work Completed (Payment Pending)
              </h6>
            </div>
            <div className="card-body p-20">
              {paymentReminders.unpaidCompletedStages.length > 0 ? (
                paymentReminders.unpaidCompletedStages.map((item, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between p-12 mb-12 radius-8 border-start border-1 border-warning-main bg-neutral-50">
                    <div>
                      <p className="text-xs text-primary-600 fw-bold mb-1 uppercase">{item.projectName}</p>
                      <h6 className="text-sm mb-1">{item.stage_Name}</h6>
                      <h6 className="text-xs mb-1">{item.customerName}</h6>
                      <p className="text-xs fw-bold text-warning-main mb-0">
                        Pending: {formatCurrency(item.balance)}
                      </p>
                      <small className="text-secondary-light">Status: Work Finished</small>
                    </div>
                    <Link to={`/projects/${item.projectId}`} className="btn btn-warning-600 btn-xs radius-4 text-white">Record</Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary-light py-20">All completed stages are paid.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReminders;