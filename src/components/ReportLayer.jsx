import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
// import * as XLSX from "xlsx"; // Optional: for Excel export

const ReportLayer = () => {
  const projects = useSelector((state) => state.projects.projects) || [];
  const allStages = useSelector((state) => state.stages.stage) || [];

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  // Logic: Flatten stages into a payment-centric list
  const reportData = useMemo(() => {
    let data = [];

    allStages.forEach((projectEntry) => {
      const projectDetails = projects.find((p) => (p.id || p._id) === projectEntry.projectId);
      
      projectEntry.stages.forEach((stage) => {
        const paymentDate = stage.updatedAt || stage.duration; // Fallback to duration if updatedAt isn't available
        const totalBudget = Number(stage.amount) || 0;
        const collected = Number(stage.paid) || 0;
        const pending = totalBudget - collected;

        data.push({
          customerName: projectDetails?.customerName || "N/A",
          projectName: projectDetails?.projectName || "Unknown",
          projectId: projectEntry.projectId,
          budget: totalBudget,
          collected: collected,
          pending: pending,
          paymentDate: paymentDate ? new Date(paymentDate).toISOString().split("T")[0] : "",
        });
      });
    });

    // Apply Filters
    return data.filter((item) => {
      const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = projectFilter === "" || item.projectId === projectFilter;
      const matchesDate = (!startDate || item.paymentDate >= startDate) && 
                          (!endDate || item.paymentDate <= endDate);

      return matchesSearch && matchesProject && matchesDate;
    });
  }, [allStages, projects, searchTerm, projectFilter, startDate, endDate]);

  const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-24">
      <div className="d-flex align-items-center justify-content-between mb-24">
        <h4 className="mb-0">Payment Reports</h4>
        <button className="btn btn-success-600 d-flex align-items-center gap-2">
          <Icon icon="lucide:file-spreadsheet" /> Export Excel
        </button>
      </div>

      {/* Filter Section */}
      <div className="card radius-12 border-0 shadow-sm mb-24">
        <div className="card-body p-20">
          <div className="row gy-3">
            <div className="col-lg-3">
              <label className="form-label text-sm fw-semibold">Search Customer/Project</label>
              <input type="text" className="form-control" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-lg-3">
              <label className="form-label text-sm fw-semibold">Project Wise</label>
              <select className="form-select" onChange={(e) => setProjectFilter(e.target.value)}>
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
            </div>
            <div className="col-lg-3">
              <label className="form-label text-sm fw-semibold">From Date</label>
              <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-lg-3">
              <label className="form-label text-sm fw-semibold">To Date</label>
              <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card radius-12 border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <thead className="bg-neutral-100 border-bottom">
                <tr>
                  <th className="px-20 py-12 text-sm">Customer Name</th>
                  <th className="px-20 py-12 text-sm">Project Name</th>
                  <th className="px-20 py-12 text-sm">Budget</th>
                  <th className="px-20 py-12 text-sm">Collected</th>
                  <th className="px-20 py-12 text-sm text-danger-main">Pending</th>
                  <th className="px-20 py-12 text-sm text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, i) => (
                  <tr key={i} className="border-bottom">
                    <td className="px-20 py-16 fw-semibold text-secondary-light">{item.customerName}</td>
                    <td className="px-20 py-16">{item.projectName}</td>
                    <td className="px-20 py-16">{formatCurrency(item.budget)}</td>
                    <td className="px-20 py-16 text-success-main fw-bold">{formatCurrency(item.collected)}</td>
                    <td className="px-20 py-16 text-danger-main fw-bold">{formatCurrency(item.pending)}</td>
                    <td className="px-20 py-16 text-center">
                        <span className="badge bg-neutral-200 text-secondary-light px-12">{item.paymentDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length === 0 && (
              <div className="text-center py-40">
                <Icon icon="solar:document-text-outline" className="display-4 text-neutral-300" />
                <p className="text-secondary-light mt-2">No records found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLayer;