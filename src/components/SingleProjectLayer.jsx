import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { 
  addStageFunction, 
  deleteStageDocumentFunction, 
  recordDocumentFunction, 
  recordStagePaymentFunction, 
  updateStageStatusFunction
} from "../features/stages/stageService";
import { stagePaymentCollection } from "../features/payment/paymentService";
import HasPermission from "./HasPermission";

const SingleProjectLayer = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("mode") === "view";
  // Selectors
  const projectList = useSelector((state) => state.projects.projects) || [];
  const stages = useSelector((state) => state.stages.stage) || [];

  const [customerId, setCustomerId] = useState("");

  // For file Uploads
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [forceReupload, setForceReupload] = useState(false);

  // Lookups
  const currentProject = useMemo(() => {
    return projectList.find((proj) => (proj.id || proj._id) === id);
  }, [projectList, id]);

  useEffect(() => {
    if (currentProject?.customerId) {
      setCustomerId(currentProject.customerId);
    }
  }, [currentProject]);

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

  // --- MATHEMATICAL CALCULATIONS ---
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

  const activeStageIndex = useMemo(() => {
    return stagesList.findIndex(s => {
      const goal = Number(s?.amount) || 0;
      const paid = Number(s?.paid) || 0;
      return paid < goal;
    });
  }, [stagesList]);

  // --- ACTIONS ---

const addNewStage = async () => {
    const totalAllocated = stagesList.reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
    const remainingBudgetToAllocate = Number(totals.cost) - totalAllocated;

    if (remainingBudgetToAllocate <= 0) {
      Swal.fire("Full", "Total budget has already been allocated to stages.", "info");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: '<span style="font-size: 25px">Add New Stage</span>',
      width: window.innerWidth < 500 ? '95%' : '450px',
      html: `
        <div class="text-start">
          <p class="text-primary-600 fw-bold mb-10" style="font-size: 12px;">
            Available to Allocate: ${formatCurrency(remainingBudgetToAllocate)}
          </p>
          
          <div class="mb-3">
            <label class="text-xs fw-bold mb-1">Stage Name</label>
            <input id="swal-input1" class="form-control text-sm" placeholder="e.g. Fabrication">
            <div id="error-name" class="text-danger d-none" style="font-size: 11px; margin-top: 4px;">Stage name is required.</div>
          </div>

          <div class="mb-3">
            <label class="text-xs fw-bold mb-1">Description</label>
            <textarea id="swal-input2" class="form-control text-sm" rows="2" placeholder="Details..."></textarea>
            <div id="error-desc" class="text-danger d-none" style="font-size: 11px; margin-top: 4px;">Description must be added.</div>
          </div>

          <div class="row g-2">
            <div class="col-6">
               <label class="text-xs fw-bold mb-1">Stage Amount (₹)</label>
               <input id="swal-input3" type="number" class="form-control text-sm" placeholder="Max: ${remainingBudgetToAllocate}">
               <div id="error-amount" class="text-danger d-none" style="font-size: 11px; margin-top: 4px;">Invalid amount.</div>
            </div>
            <div class="col-6">
               <label class="text-xs fw-bold mb-1">Duration (Optional)</label>
               <input id="swal-input4" type="datetime-local" class="form-control text-sm">
            </div>
          </div>
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value.trim();
        const desc = document.getElementById('swal-input2').value.trim();
        const amt = Number(document.getElementById('swal-input3').value);
        const duration = document.getElementById('swal-input4').value;

        // Reset Error Visibility
        document.getElementById('error-name').classList.add('d-none');
        document.getElementById('error-desc').classList.add('d-none');
        document.getElementById('error-amount').classList.add('d-none');

        let isValid = true;

        if (!name) {
          document.getElementById('error-name').classList.remove('d-none');
          isValid = false;
        }
        if (!desc) {
          document.getElementById('error-desc').classList.remove('d-none');
          isValid = false;
        }
        if (!amt || amt <= 0) {
          document.getElementById('error-amount').innerText = "Required";
          document.getElementById('error-amount').classList.remove('d-none');
          isValid = false;
        } else if (amt > remainingBudgetToAllocate) {
          document.getElementById('error-amount').innerText = "Exceeds budget";
          document.getElementById('error-amount').classList.remove('d-none');
          isValid = false;
        }

        if (!isValid) return false; // This prevents the modal from closing

        return [name, desc, amt, duration];
      }
    });

    if (formValues) {
      // Existing functionality preserved: passing values to dispatch
      addStageFunction(dispatch, { 
        customer_id: customerId, 
        stage_Name: formValues[0], 
        description: formValues[1], 
        amount: formValues[2],
        duration: formValues[3] // Added duration to your existing payload structure
      }, id);
      setIsDocumentUploaded(false);
    }
  };

  const recordPayment = async (stageId, stageAmount, stagePaid) => {
    const stageRemaining = Math.max(0, Number(stageAmount) - Number(stagePaid));

    const { value: formValues } = await Swal.fire({
      title: '<span style="font-size: 25px">Record Payment</span>',
      width: window.innerWidth < 500 ? '95%' : '350px',
html: `
  <div style="text-align: left; padding: 0 5px;">
    <p style="color: #64748b; margin-bottom: 12px; font-size: 12px; font-weight: 500;">
      Stage Balance: <span style="color: #ef4444; font-weight: 700;">${formatCurrency(stageRemaining)}</span>
    </p>

    <div style="margin-bottom: 16px;">
      <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Payment Amount (₹)</label>
      <input id="swal-payment" type="number" class="form-control" value="${stageRemaining}" 
             style="width: 100%; display: block; height: 42px;">
    </div>

    <div style="margin-bottom: 8px;">
      <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Payment Mode</label>
      <select id="swal-mode" class="form-select" 
              style="width: 100% !important; 
                     display: block !important; 
                     height: 42px !important; 
                     visibility: visible !important; 
                     opacity: 1 !important;
                     position: relative !important;
                     z-index: 9999 !important;">
        <option value="" disabled selected>Select Payment Mode</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
    </div>
  </div>`,
      preConfirm: () => {
        const paymentAmount = Number(document.getElementById('swal-payment').value);
        const paymentMode = document.getElementById('swal-mode').value;
        const paymentDate = new Date().toISOString()
        
        if (!paymentAmount || paymentAmount <= 0) return Swal.showValidationMessage('Invalid amount');
        if (paymentAmount > stageRemaining) return Swal.showValidationMessage(`Maximum allowed is ${formatCurrency(stageRemaining)}`);

        let paymentStatus;
        if (paymentAmount === stageRemaining) {
          paymentStatus = "paid";
        } else {
          paymentStatus = "partially paid";
        }

        return {paymentAmount,paymentMode,paymentDate,paymentStatus};
      }
    });

    if (formValues) {

      console.log( {amount: formValues.paymentAmount,payment_mode : formValues.paymentMode,payment_date : formValues.paymentDate,payment_status : formValues.paymentStatus}, stageId, id);
      

      const success = await recordStagePaymentFunction(dispatch, { amount: formValues.paymentAmount,payment_mode : formValues.paymentMode,payment_date : formValues.paymentDate,payment_status : formValues.paymentStatus}, stageId, id);
      
     await stagePaymentCollection(dispatch,{ 
  stage_amount : stageAmount,
  amount: formValues.paymentAmount, 
  payment_mode: formValues.paymentMode, 
  payment_date: formValues.paymentDate, 
  payment_status: formValues.paymentStatus,
  customerId: customerId,
  budget : totals.cost,
  customerName: currentProject?.customerName || "N/A", 
  projectName: currentProject?.projectName || "N/A"
}, stageId, id);

      if (success) {
        setIsDocumentUploaded(false);
        setUploadedFile(null);
      }
    }
  };

  const fileUpload = (stageId) => {
    const extraInput = document.createElement("input");
    extraInput.type = "file";
    extraInput.multiple = true;

    const mainInput = document.createElement("input");
    mainInput.type = "file";
    mainInput.multiple = true;

    mainInput.onchange = async (e) => {
      let files = Array.from(e.target.files);
      if (files.length === 0) return;

      const renderFileList = (currentFiles) => {
        if (currentFiles.length === 0) {
          return `
            <div class="text-center py-20">
              <p class="text-danger text-sm mb-2">All files removed.</p>
              <button type="button" class="btn btn-sm btn-outline-primary add-more-btn">Select Files Again</button>
            </div>`;
        }
        
        return `
          <div class="mb-10 d-flex justify-content-between align-items-center">
            <span class="text-xs fw-bold text-uppercase text-secondary-light">Selected Files</span>
            <button type="button" class="btn btn-sm btn-primary-100 text-primary-600 add-more-btn">+ Add More</button>
          </div>
          ${currentFiles.map((file, index) => {
            const isPreviewable = file.type.startsWith('image/') || file.type === 'application/pdf';
            return `
              <div class="d-flex align-items-center justify-content-between p-8 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="badge bg-primary-100 text-primary-600">${index + 1}</span>
                  <span class="text-xs fw-bold text-truncate" style="max-width: 140px;">${file.name}</span>
                </div>
                <div class="d-flex gap-1">
                  ${isPreviewable ? `
                    <button type="button" class="btn btn-outline-primary btn-xs p-1 preview-file-btn d-flex align-items-center justify-content-center" data-index="${index}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8s11 8 11 8s-4 8-11 8s-11-8-11-8m11-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/ class = "border"></svg>
                    </button>` : ''}
                  <button type="button" class="btn btn-outline-danger btn-xs p-1 remove-file-btn d-flex align-items-center justify-content-center" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                  </button>
                </div>
              </div>`;
          }).join('')}`;
      };

      const { value: finalFiles, isConfirmed } = await Swal.fire({
        title: '<span style="font-size: 25px">Review Uploads</span>',
        width: window.innerWidth < 500 ? '95%' : '450px',
        html: `
          <div class="text-start">
            <div id="swal-file-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #f1f1f1; border-radius: 8px; ">
              ${renderFileList(files)}
            </div>
          </div>`,
        showCancelButton: true,
        confirmButtonText: 'Upload Selected',
        confirmButtonColor: '#3d5ee1',
        didRender: () => {
          const container = document.getElementById('swal-file-container');
          container.addEventListener('click', (event) => {
            const removeBtn = event.target.closest('.remove-file-btn');
            const previewBtn = event.target.closest('.preview-file-btn');
            const addMoreBtn = event.target.closest('.add-more-btn');

            if (removeBtn) {
              const idx = parseInt(removeBtn.getAttribute('data-index'));
              files.splice(idx, 1);
              container.innerHTML = renderFileList(files);
              Swal.getConfirmButton().disabled = files.length === 0;
            }
            if (previewBtn) {
              const idx = parseInt(previewBtn.getAttribute('data-index'));
              const url = URL.createObjectURL(files[idx]);
              window.open(url, '_blank');
            }
            if (addMoreBtn) extraInput.click();
          });

          extraInput.onchange = (event) => {
            const newFiles = Array.from(event.target.files);
            files = [...files, ...newFiles];
            container.innerHTML = renderFileList(files);
            Swal.getConfirmButton().disabled = files.length === 0;
            extraInput.value = "";
          };
        },
        preConfirm: async () => {
          if (files.length === 0) return Swal.showValidationMessage('No files to upload');
          try {
            const data = new FormData();
            files.forEach((file) => data.append("documents", file));
            data.append("projectId", id);
            data.append("stageId", stageId);
            data.append("customerId", customerId);
            await recordDocumentFunction(dispatch, id, stageId, customerId, data);
            return files;
          } catch (error) {
            Swal.showValidationMessage(`Upload failed: ${error.message}`);
          }
        }
      });

      if (isConfirmed && finalFiles) {
        setUploadedFile(finalFiles);
        setIsDocumentUploaded(true);
        setForceReupload(false);
        Swal.fire({ title:'<span style="font-size: 25px">Uploaded</span>', icon: "success", timer: 1500, showConfirmButton: false });
      }
    };
    mainInput.click();
  };

const clearFileSelection = async (stageId) => {
  const result = await Swal.fire({
    title: '<span style="font-size: 25px">Are You Sure ?</span>',
    text: "This will permanently delete the uploaded files from the server.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    const success = await deleteStageDocumentFunction(dispatch, id, stageId);
    
    if (success) {
      
      setUploadedFile(null); 
      
      // 2. Reset the session flag
      setIsDocumentUploaded(false);
      
      // 3. Force the UI to ignore the old path from Redux
      setForceReupload(true);

      Swal.fire({
        title: '<span style="font-size: 25px">Deleted</span>',
        text: "Files have been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }
};

  const openPreviewModal = (stage) => {
    if (uploadedFile && uploadedFile.length > 0) {
      const filesHtml = uploadedFile.map((file, index) => {
        const fileURL = URL.createObjectURL(file);
        const isImage = file.type.startsWith('image/');
        return `
          <div class="d-flex align-items-center justify-content-between p-10 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <span class="badge bg-primary-100 text-primary-600">${index + 1}</span>
              <span class="text-sm fw-bold text-truncate" style="max-width: 180px;">${file.name}</span>
            </div>
            <div class="d-flex gap-2">
              ${isImage ? `<a href="${fileURL}" target="_blank" class="btn btn-xs btn-outline-primary">View</a>` : ''}
              <a href="${fileURL}" download="${file.name}" class="btn btn-xs btn-primary-600">Download</a>
            </div>
          </div>`;
      }).join('');

      return Swal.fire({
        title: '<span style="font-size: 25px">Recently Uploaded</span>',
        html: `<div class="text-start" style="max-height: 350px; overflow-y: auto;">${filesHtml}</div>`,
        width: window.innerWidth < 500 ? '95%' : '500px',
        showCloseButton: true,
        showConfirmButton: false,
      });
    }

    if (stage?.documentPath) {
      const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(stage.documentPath);
      const isPdf = stage.documentPath.toLowerCase().endsWith('.pdf');
      let contentHtml = isImage ? `<img src="${stage.documentPath}" class="img-fluid radius-8" style="max-height: 400px;">` 
                      : isPdf ? `<iframe src="${stage.documentPath}" width="100%" height="500px" style="border: none;"></iframe>`
                      : `<div class="text-center p-20"><Icon icon="solar:file-bold" class="display-4 text-primary mb-3" /><p>Document is available</p><a href="${stage.documentPath}" target="_blank" class="btn btn-primary-600 btn-sm">Open in New Tab</a></div>`;

      Swal.fire({
        title: 'Stage Document',
        html: contentHtml,
        width: window.innerWidth < 600 ? '95%' : '600px',
        showCloseButton: true,
        showConfirmButton: false,
      });
    }
  };


  const updateStatus = async (stageId, currentStatus) => {
    const { value: newStatus } = await Swal.fire({
        title: 'Update Stage Status',
        input: 'select',
        inputOptions: {
            'Initialized': 'Initialized',
            'In Progress': 'In Progress',
            'Completed': 'Completed'
        },
        inputValue: currentStatus,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'You need to select a status';
        }
    });

    if (newStatus && newStatus !== currentStatus) {
        // Replace with your actual service call
        await updateStageStatusFunction(dispatch, { status: newStatus }, stageId, id);
    }
};

  return (
    <div className="p-12 p-md-24 bg-base radius-12 shadow-sm border">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-24">
        <div>
          <h5 className="mb-4 text-primary-900">{currentProject?.projectName || "Project Progress"}</h5>
          <p className="text-secondary-light text-sm mb-0">Project tracking for {currentProject?.projectName}</p>
        </div>
      <HasPermission permission={"manage-payment"}>
        {!isReadOnly && (
        <button onClick={addNewStage} className="btn btn-primary-600 btn-sm d-flex align-items-center gap-2 radius-8 w-sm-auto justify-content-center">
          <Icon icon="ic:baseline-plus" /> Add Stage
        </button>
          )}
          </HasPermission>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 gy-4 mb-32">
        {[
          { label: "Total Budget", val: totals.cost, color: "bg-gradient-start-1", text: "" },
          { label: "Total Collected", val: totals.paid, color: "bg-gradient-start-2", text: "text-success-main" },
          { label: "Stage Outstanding", val: totals.balance, color: "bg-gradient-start-5", text: "text-danger-main" },
          { label: "Remaining Balance", val: totals.cost - totals.paid, color: "bg-gradient-start-4", text: "text-warning" }
        ].map((item, i) => (
          <div className="col" key={i}>
            <div className={`card shadow-none border ${item.color} p-16 p-md-20 h-100`}>
              <p className="fw-medium text-primary-light mb-1 text-sm text-uppercase">{item.label}</p>
              <h6 className={`mb-0 text-md ${item.text}`}>{formatCurrency(item.val)}</h6>
            </div>
          </div>
        ))}
      </div>

      <div className="position-relative ms-4 ms-sm-12">
        {stagesList.length > 0 ? (
          <>
            <div className="position-absolute h-100 border-start border-2 border-neutral-200" style={{ left: "6px", top: "0" }}></div>
            {stagesList.map((stage, index) => {
              const goal = Number(stage.amount) || 0;
              const paid = Number(stage.paid) || 0;
              const pending = Math.max(0, goal - paid);
              const isCompleted = paid >= goal;

              return (
                <div key={stage.id} className={`position-relative ps-24 ps-sm-32 ${index !== stagesList.length - 1 ? 'mb-32' : ''}`}>
                  <div className={`position-absolute rounded-circle transition-all ${isCompleted ? 'bg-success-main shadow-lg' : 'bg-neutral-400'}`}
                    style={{ left: "0", top: "6px", width: "14px", height: "14px", zIndex: 1, border: "3px solid white" }}></div>

                  <div className="row align-items-start gy-3">
                    <div className="col-xl-6 col-lg-7">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className={`mb-0 text-md fw-bold ${isCompleted ? 'text-success-main' : ''}`}>{stage.stage_Name}</h6>
                         <div className={`d-flex align-items-center gap-2 px-12 py-4 radius-4 border ${
    stage.status === 'Completed' ? 'bg-success-50 border-success-100 text-success-600' :
    stage.status === 'In Progress' ? 'bg-warning-50 border-warning-100 text-warning-600' :
    'bg-info-50 border-info-100 text-info-600'
  }`} style={{width : "max-content"}}>
    <span className={`w-8 h-8 rounded-circle ${
      stage.status === 'Completed' ? 'bg-success-main' :
      stage.status === 'In Progress' ? 'bg-warning-main' : 'bg-info-main'
    }`}></span>
    <span className="text-xxs fw-bold text-uppercase">{stage.status || 'Initialized'}</span>
  </div>

  <HasPermission permission={"upload-docs"}>
                        {index === activeStageIndex && !isReadOnly && (
                        (<button 
    onClick={() => updateStatus(stage.id, stage.status || 'Initialized')}
    className="btn p-0 border-0 d-flex align-items-center text-primary-light hover-text-primary"
    title="Update Status"
  >
    <Icon icon="lucide:edit-3" width="14" />
  </button>))}
  </HasPermission>
                        {isCompleted && <Icon icon="icon-park-solid:check-one" className="text-success-main" />}
                      </div>
                      <p className="text-secondary-light text-sm mb-12">{stage.description}</p>
                      {stage.duration && (
  <p className="text-sm text-secondary-light mb-8 d-flex align-items-center gap-2">
    <Icon icon="solar:calendar-bold" className="mr-2" /> {" "}
    Deadline: {new Date(stage.duration).toLocaleString()}
  </p>
)}
                      <div className="d-flex flex-column flex-md-row gap-4">

                      
                      {index === activeStageIndex && (
                        <div className="d-flex flex-wrap gap-2 gap-sm-3">
                          <div className="d-flex align-items-center gap-2">
                            {(isDocumentUploaded || (stage.documentPath && !forceReupload)) ? (
                              <>
                              <HasPermission permission={"upload-docs"}>

                               {!isReadOnly && (
                                 <button onClick={() => openPreviewModal(stage)} className="btn btn-success-100 text-success-600 btn-sm py-4 px-12 text-xs radius-4 d-flex align-items-center gap-2">
                                  <Icon icon="solar:documents-bold" /> <span className="d-none d-sm-inline">View Docs</span><span className="d-inline d-sm-none">View</span>
                                </button>
                               )}
                               </HasPermission>

                               <HasPermission permission={"upload-docs"}>

                                {!isReadOnly && (
                                  <button onClick={() => clearFileSelection(stage.id)} className="btn btn-danger-100 text-danger-600 btn-sm p-4 radius-4 d-flex align-items-center justify-content-center"><Icon icon="ic:round-close" className="text-sm" /></button>
                                )}
                                </HasPermission>
                              </>
                            ) : (

                              <HasPermission permission={"upload-docs"}>
  {!isReadOnly && (
    <button 
      onClick={() => fileUpload(stage.id)} 
      className="btn btn-primary-600 btn-md py-4 px-12 text-xs radius-4 d-flex align-items-center gap-2"
    >
      <Icon icon="solar:upload-bold" /> Upload
    </button>
  )}
</HasPermission>
                            )}
                          </div>

                          <HasPermission permission={"manage-payment"}>

                          {!isReadOnly && (
                            
                            <button onClick={() => recordPayment(stage.id, goal, paid)} className="btn btn-success-600 btn-sm py-4 px-12 text-xs radius-4 d-flex align-items-center gap-2 d-flex align-items-center justify-content-center" disabled={!isDocumentUploaded && (!stage.documentPath || forceReupload)}>
                            <Icon icon="solar:cash-out-bold" /> Record Payment
                          </button>
                          )}
                          </HasPermission>
                        
                        </div>
                      )}
                      

                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-5">
                      <div className="d-flex bg-neutral-50 p-12 radius-8 border">
                        <div className="text-center flex-fill border-end">
                          <p className="text-sm text-neutral-500 fw-bold mb-1 uppercase">Goal</p>
                          <p className="text-md fw-bold mb-0">{formatCurrency(goal)}</p>
                        </div>
                        <div className="text-center flex-fill border-end px-1">
                          <p className="text-sm text-neutral-500 fw-bold mb-1 uppercase">Paid</p>
                          <p className="text-md fw-bold mb-0 text-success-main">{formatCurrency(paid)}</p>
                        </div>
                        <div className="text-center flex-fill ps-1">
                          <p className="text-sm text-neutral-500 fw-bold mb-1 uppercase">Pending</p>
                          <p className={`text-md fw-bold mb-0 ${pending > 0 ? 'text-danger-main' : 'text-success-main'}`}>{formatCurrency(pending)}</p>
                        </div>
                        <div className="text-center flex-fill ps-1">
                          <p className="text-sm text-neutral-500 fw-bold mb-1 uppercase">Payment Status</p>
                          <p className={`text-md fw-bold text-capitalize mb-0 ${stage.payment_status === "partially paid" || stage.payment_status === "pending" ? 'text-danger-main' : 'text-success-main'}`}>
  {stage.payment_status}
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