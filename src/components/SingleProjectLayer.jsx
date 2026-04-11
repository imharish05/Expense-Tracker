import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { 
  addStageFunction, 
  recordStagePaymentFunction 
} from "../features/stages/stageService";

const SingleProjectLayer = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Selectors
  const projectList = useSelector((state) => state.projects.projects) || [];
  const stages = useSelector((state) => state.stages.stage) || [];

  // Lookups
  const currentProject = useMemo(() => {
    return projectList.find((proj) => (proj.id || proj._id) === id);
  }, [projectList, id]);

  const activeProjectProgress = useMemo(() => {
    return stages.find(item => item.projectId === id);
  }, [stages, id]);

  const stagesList = activeProjectProgress?.stages || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

// --- STRICT MATHEMATICAL CALCULATIONS ---
const totals = useMemo(() => {
  const projectBudget = Number(currentProject?.project_Budget || currentProject?.cost || 0);

  const totalCollected = stagesList.reduce((acc, stage) => acc + (Number(stage?.paid) || 0), 0);
  const totalPending = stagesList.reduce((acc, stage) => {
    const goal = Number(stage?.amount) || 0;
    const paid = Number(stage?.paid) || 0;
    return acc + Math.max(0, goal - paid);
  }, 0);

  return {
    cost: projectBudget,
    paid: totalCollected,
    balance: totalPending,
  };
}, [stagesList, currentProject]);
  // Find the FIRST stage that is not yet fully paid
  const activeStageIndex = useMemo(() => {
    return stagesList.findIndex(s => {
      const goal = Number(s?.amount) || 0;
      const paid = Number(s?.paid) || 0;
      return paid < goal;
    });
  }, [stagesList]);

  const addNewStage = async () => {
    const totalAllocated = stagesList.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    const remainingBudgetToAllocate = Number(totals.cost) - totalAllocated;

    if (remainingBudgetToAllocate <= 0) {
      Swal.fire("Full", "Total budget has already been allocated to stages.", "info");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Add New Stage',
      width: '400px',
      html: `
        <div class="text-start">
          <p class="text-primary-600 fw-bold mb-10" style="font-size: 12px;">
            Available to Allocate: ${formatCurrency(remainingBudgetToAllocate)}
          </p>
          <label class="text-xs fw-bold mb-1">Stage Name</label>
          <input id="swal-input1" class="form-control mb-3 text-sm" placeholder="e.g. Fabrication">
          <label class="text-xs fw-bold mb-1">Description</label>
          <input id="swal-input2" class="form-control mb-3 text-sm" placeholder="Details...">
          <label class="text-xs fw-bold mb-1">Stage Amount (₹)</label>
          <input id="swal-input3" type="number" class="form-control text-sm" placeholder="Max: ${remainingBudgetToAllocate}">
        </div>`,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const amt = Number(document.getElementById('swal-input3').value);
        if (!name || !amt) return Swal.showValidationMessage('Required');
        if (amt > remainingBudgetToAllocate) return Swal.showValidationMessage('Exceeds available budget');
        return [name, document.getElementById('swal-input2').value, amt];
      }
    });

    if (formValues) {
      addStageFunction(dispatch, { stage_Name: formValues[0], description: formValues[1], amount: formValues[2]}, id);
    }
  };

const recordPayment = async (stageId, stageAmount, stagePaid) => {
    const stageRemaining = Math.max(0, Number(stageAmount) - Number(stagePaid));

    const { value: paymentAmount } = await Swal.fire({
      title: 'Record Payment',
      width: '350px',
      html: `
        <div class="text-start">
          <p class="text-secondary-light mb-8" style="font-size: 12px;">
            Stage Balance: <b class="text-danger">${formatCurrency(stageRemaining)}</b>
          </p>
          <label class="text-xs fw-bold mb-1">Enter Payment Amount (₹)</label>
          <input id="swal-payment" type="number" class="form-control text-sm" value="${stageRemaining}">
        </div>`,
      preConfirm: () => {
        const val = Number(document.getElementById('swal-payment').value);
        if (!val || val <= 0) return Swal.showValidationMessage('Invalid amount');
        
        // STRICT BLOCK: Prevent overpayment in the UI
        if (val > stageRemaining) {
          return Swal.showValidationMessage(`Maximum allowed is ${formatCurrency(stageRemaining)}`);
        }
        return val;
      }
    });

    if (paymentAmount) {
      recordStagePaymentFunction(dispatch, { amount: paymentAmount }, stageId, id);
    }
  };
  return (
    <div className="p-20 bg-base radius-12 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-24">
        <div>
          <h5 className="mb-4 text-primary-900">{currentProject?.projectName || "Project Progress"}</h5>
          <p className="text-secondary-light text-sm mb-0">Project tracking for {currentProject?.projectName}</p>
        </div>
        <button onClick={addNewStage} className="btn btn-primary-600 btn-sm d-flex align-items-center gap-2 radius-8">
          <Icon icon="ic:baseline-plus" /> Add Stage
        </button>
      </div>

      <div className="row row-cols-3 gy-4 mb-32">
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-1 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs text-uppercase">Total Budget</p>
            <h6 className="mb-0">{formatCurrency(totals.cost)}</h6>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-2 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs text-uppercase">Total Collected</p>
            <h6 className="mb-0 text-success-main">{formatCurrency(totals.paid)}</h6>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-5 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs text-uppercase">Outstanding</p>
            <h6 className="mb-0 text-danger-main">{formatCurrency(totals.balance)}</h6>
          </div>
        </div>
      </div>

      <div className="position-relative ms-12">
        {stagesList.length > 0 ? (
          <>
            <div className="position-absolute h-100 border-start border-2 border-neutral-200" style={{ left: "6px", top: "0" }}></div>
            {stagesList.map((stage, index) => {
              const goal = Number(stage.amount) || 0;
              const paid = Number(stage.paid) || 0;
              const pending = Math.max(0, goal - paid);
              const isCompleted = paid >= goal;

              return (
                <div key={stage.id} className={`position-relative ps-32 ${index !== stagesList.length - 1 ? 'mb-32' : ''}`}>
                  <div className={`position-absolute rounded-circle transition-all ${isCompleted ? 'bg-success-main shadow-lg' : 'bg-neutral-400'}`}
                    style={{ left: "0", top: "6px", width: "14px", height: "14px", zIndex: 1, border: "3px solid white" }}></div>

                  <div className="row align-items-center gy-3">
                    <div className="col-lg-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className={`mb-0 text-sm fw-bold ${isCompleted ? 'text-success-main' : ''}`}>{stage.stage_Name}</h6>
                        {isCompleted && <Icon icon="icon-park-solid:check-one" className="text-success-main" />}
                      </div>
                      <p className="text-secondary-light text-xs mb-12">{stage.description}</p>
                      {index === activeStageIndex && (
                        <button onClick={() => recordPayment(stage.id, goal, paid)} className="btn btn-success-600 btn-sm py-4 px-12 text-xxs radius-4 d-flex align-items-center gap-2">
                          <Icon icon="solar:cash-out-bold" /> Record Payment
                        </button>
                      )}
                    </div>

                    <div className="col-lg-6">
                      <div className="d-flex justify-content-between bg-neutral-50 p-12 radius-8 border">
                        <div className="text-center flex-fill border-end">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Goal</p>
                          <p className="text-xs fw-bold mb-0">{formatCurrency(goal)}</p>
                        </div>
                        <div className="text-center flex-fill border-end px-2">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Paid</p>
                          <p className="text-xs fw-bold mb-0 text-success-main">{formatCurrency(paid)}</p>
                        </div>
                        <div className="text-center flex-fill ps-2">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Pending</p>
                          <p className={`text-xs fw-bold mb-0 ${pending > 0 ? 'text-danger-main' : 'text-success-main'}`}>
                            {formatCurrency(pending)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-40 bg-neutral-50 radius-12 border border-dashed">
            <Icon icon="solar:playlist-2-bold-duotone" className="text-neutral-300 display-4 mb-16" />
            <p className="text-secondary-light mb-0">No stages created.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProjectLayer;