import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

const SingleProjectLayer = () => {
  const [stages, setStages] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totals = stages.reduce(
    (acc, stage) => ({
      cost: acc.cost + stage.amount,
      paid: acc.paid + stage.paid,
      balance: acc.balance + (stage.amount - stage.paid),
    }),
    { cost: 0, paid: 0, balance: 0 }
  );

  const addNewStage = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Stage',
      width: '400px',
      html:
        '<div class="text-start">' +
        '<label class="text-xs fw-bold mb-1">Stage Name</label>' +
        '<input id="swal-input1" class="form-control mb-3 text-sm" placeholder="e.g. Foundation Work">' +
        '<label class="text-xs fw-bold mb-1">Description</label>' +
        '<input id="swal-input2" class="form-control mb-3 text-sm" placeholder="Brief details...">' +
        '<label class="text-xs fw-bold mb-1">Stage Amount (₹)</label>' +
        '<input id="swal-input3" type="number" class="form-control text-sm" placeholder="0">' +
        '</div>',
      focusConfirm: false,
      showCloseButton: true,
      confirmButtonText: 'Create Stage',
      confirmButtonColor: "#4834d4",
      customClass: {
        title: 'text-md fw-bold',
        popup: 'radius-12',
        confirmButton: 'btn btn-primary-600 px-24 py-10 radius-8 text-sm'
      },
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const amount = document.getElementById('swal-input3').value;
        if (!name || !amount) {
          Swal.showValidationMessage('Please enter Name and Amount');
          return false;
        }
        return [name, document.getElementById('swal-input2').value, amount];
      }
    });

    if (formValues) {
      const newStage = {
        id: Date.now(),
        name: formValues[0],
        description: formValues[1],
        amount: Number(formValues[2]) || 0,
        paid: 0,
        status: "Pending"
      };
      setStages([...stages, newStage]);
    }
  };

const recordPayment = async (stageId, currentBalance) => {
    const { value: paymentAmount } = await Swal.fire({
      title: 'Record Payment',
      width: '350px',
      html: 
        `<div class="text-start">` +
        `<p class="text-secondary-light mb-8" style="font-size: 12px;">Remaining Balance: <b>${formatCurrency(currentBalance)}</b></p>` +
        `<label class="text-xs fw-bold mb-1">Enter Amount Received (₹)</label>` +
        `<input id="swal-payment" type="number" class="form-control text-sm" placeholder="e.g. 50000">` +
        `</div>`,
      confirmButtonText: 'Update Paid Amount',
      confirmButtonColor: "#28a745",
      customClass: {
        title: 'text-md fw-bold pt-20',
        popup: 'radius-12 px-12 pb-20',
        confirmButton: 'btn btn-success-600 px-20 py-10 radius-8 text-xs w-100'
      },
      preConfirm: () => {
        const val = document.getElementById('swal-payment').value;
        if (!val || val <= 0) {
          Swal.showValidationMessage('Please enter a valid amount');
          return false;
        }
        if (Number(val) > currentBalance) {
          Swal.showValidationMessage('Amount cannot exceed balance');
          return false;
        }
        return Number(val);
      }
    });

    // If a valid amount was entered, update the state
    if (paymentAmount) {
      setStages(prevStages => 
        prevStages.map(stage => {
          if (stage.id === stageId) {
            const updatedPaid = stage.paid + paymentAmount; // Adds new payment to existing paid
            const isFullyPaid = updatedPaid >= stage.amount;
            
            return {
              ...stage,
              paid: updatedPaid,
              status: isFullyPaid ? "Completed" : "In Progress"
            };
          }
          return stage;
        })
      );
      
      // Success Notification
Swal.fire({
        icon: 'success',
        title: 'Payment Recorded',
        text: `${formatCurrency(paymentAmount)} added to paid section.`,
        timer: 1500,
        showConfirmButton: false,
        width: '320px', // Smaller width for success check
        customClass: {
          popup: 'radius-12 py-20',
          title: 'text-md fw-bold mb-4', // Matches your dashboard font size
          htmlContainer: 'text-xs text-secondary-light' // Makes the description text smaller
        }
      });
    }
  };
  // Find the first stage that isn't finished to show the button
  const activeStageIndex = stages.findIndex(s => s.paid < s.amount);

  return (
    <div className="p-20 bg-base radius-12 shadow-sm border">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-24">
        <div>
          <h5 className="mb-4 text-primary-900">Project Progress</h5>
          <p className="text-secondary-light text-sm mb-0">Track milestones and collections</p>
        </div>
        <button onClick={addNewStage} className="btn btn-primary-600 btn-sm d-flex align-items-center gap-2 radius-8 py-8 px-16">
          <Icon icon="ic:baseline-plus" className="text-lg" /> Add Stage
        </button>
      </div>

      {/* Summary Stats */}
      <div className="row row-cols-xxxl-3 row-cols-lg-3 row-cols-sm-1 row-cols-1 gy-4 mb-32">
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-1 h-100 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs">TOTAL BUDGET</p>
            <h6 className="mb-0">{formatCurrency(totals.cost)}</h6>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-2 h-100 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs">TOTAL COLLECTED</p>
            <h6 className="mb-0 text-success-main">{formatCurrency(totals.paid)}</h6>
          </div>
        </div>
        <div className="col">
          <div className="card shadow-none border bg-gradient-start-5 h-100 p-20">
            <p className="fw-medium text-primary-light mb-1 text-xs">OUTSTANDING</p>
            <h6 className="mb-0 text-danger-main">{formatCurrency(totals.balance)}</h6>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="position-relative ms-12">
        {stages.length > 0 ? (
          <>
            <div className="position-absolute h-100 border-start border-2 border-neutral-200" style={{ left: "6px", top: "0" }}></div>
            {stages.map((stage, index) => {
              const isLast = index === stages.length - 1;
              const balance = stage.amount - stage.paid;
              const isCompleted = stage.paid >= stage.amount;

              return (
                <div key={stage.id} className={`position-relative ps-32 ${!isLast ? 'mb-32' : ''}`}>
                  {/* Timeline Dot with "fill" logic */}
                  <div 
                    className={`position-absolute rounded-circle transition-all ${isCompleted ? 'bg-success-main shadow-lg' : 'bg-neutral-400'}`}
                    style={{ 
                      left: "0", top: "6px", width: "14px", height: "14px", zIndex: 1, 
                      border: "3px solid white", outline: isCompleted ? "1px solid #28a745" : "none"
                    }}
                  ></div>

                  <div className="row align-items-center gy-3">
                    <div className="col-lg-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className={`mb-0 text-sm fw-bold ${isCompleted ? 'text-success-main' : ''}`}>{stage.name}</h6>
                        {isCompleted && <Icon icon="icon-park-solid:check-one" className="text-success-main" />}
                      </div>
                      <p className="text-secondary-light text-xs mb-12">{stage.description}</p>
                      
                      {/* Sequential Payment Button */}
                      {index === activeStageIndex && (
                        <button 
                          onClick={() => recordPayment(stage.id, balance)}
                          className="btn btn-success-600 text-white btn-sm py-4 px-12 text-xxs radius-4 d-flex align-items-center gap-2"
                        >
                           <Icon icon="solar:cash-out-bold" /> Record Payment
                        </button>
                      )}
                    </div>

                    <div className="col-lg-6">
                      <div className="d-flex justify-content-between bg-neutral-50 p-12 radius-8 border">
                        <div className="text-center flex-fill border-end border-neutral-200">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Stage</p>
                          <p className="text-xs fw-bold mb-0">{formatCurrency(stage.amount)}</p>
                        </div>
                        <div className="text-center flex-fill border-end border-neutral-200 px-2">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Paid</p>
                          <p className="text-xs fw-bold mb-0 text-success-main">{formatCurrency(stage.paid)}</p>
                        </div>
                        <div className="text-center flex-fill ps-2">
                          <p className="text-xxs text-neutral-500 fw-bold mb-1 uppercase">Balance</p>
                          <p className={`text-xs fw-bold mb-0 ${balance > 0 ? 'text-danger-main' : 'text-success-main'}`}>
                            {formatCurrency(balance)}
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
            <p className="text-secondary-light mb-0">No stages created. Start by adding your first project milestone.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProjectLayer;