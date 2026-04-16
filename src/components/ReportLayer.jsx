import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

const ReportLayer = () => {
  // Select the specific payment collection data
  const payments = useSelector((state) => state.payments.payments) || [];
  const projects = useSelector((state) => state.projects.projects) || [];

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Project Searchable Dropdown States
  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Pagination States
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter the projects for the dropdown
  const filteredProjectOptions = useMemo(() => {
    return projects.filter(p => 
      (p.projectName || "").toLowerCase().includes(projectSearchTerm.toLowerCase())
    );
  }, [projects, projectSearchTerm]);

  // Transform and Filter Logic
  const reportData = useMemo(() => {
    return payments
      .map((pay) => ({
        ...pay,
        // Format date for filtering (YYYY-MM-DD)
        formattedDate: pay.paymentDate ? pay.paymentDate.split("T")[0] : "",
      }))
      .filter((item) => {
        const matchesSearch = 
          item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesProject = selectedProjectId === "" || item.projectId === selectedProjectId;
        
        const matchesDate = 
          (!startDate || item.formattedDate >= startDate) && 
          (!endDate || item.formattedDate <= endDate);

        return matchesSearch && matchesProject && matchesDate;
      });
  }, [payments, searchTerm, selectedProjectId, startDate, endDate]);

  const paginatedData = useMemo(() => {
    return reportData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [reportData, currentPage, itemsPerPage]);

  const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { 
    style: "currency", 
    currency: "INR", 
    maximumFractionDigits: 0 
  }).format(val);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "Payment_Collection_Report.xlsx");
  };

  return (
    <div className="card h-100 p-0 radius-12 shadow-sm border">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <select
            className="form-select form-select-sm w-auto ps-12 radius-12 h-40-px"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            {[5, 10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto border radius-8 "
              placeholder="Search customer..."
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Icon icon="ion:search-outline" className="icon position-absolute end-0 me-12 top-50 translate-middle-y text-secondary-light" />
          </div>
        </div>

        <button onClick={handleExport} className="btn btn-success-600 text-sm btn-sm px-16 py-10 radius-8 d-flex align-items-center gap-2">
          <Icon icon="lucide:file-spreadsheet" className="text-xl" />
          Export Excel
        </button>
      </div>

      <div className="card-body p-24">
        <div className="row gy-3 mb-24 pb-24 border-bottom">
          {/* PROJECT DROPDOWN */}
          <div className="col-lg-4 position-relative">
            <label className="form-label text-sm fw-semibold">Filter by Project</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control radius-8 h-40-px"
                placeholder="Type to search project..."
                value={projectSearchTerm}
                onFocus={() => setIsProjectDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsProjectDropdownOpen(false), 200)}
                onChange={(e) => {
                  setProjectSearchTerm(e.target.value);
                  if (e.target.value === "") {
                    setSelectedProjectId("");
                    setCurrentPage(1);
                  }
                }}
              />
              <Icon icon="lucide:chevron-down" className="position-absolute end-0 me-12 top-50 translate-middle-y text-muted" />
            </div>

            {isProjectDropdownOpen && (
              <ul className="position-absolute w-100 mt-1 bg-white radius-8 shadow-lg z-3 overflow-auto border" style={{ maxHeight: '200px', listStyle: 'none', padding: 0 }}>
                <li className="p-10 border-bottom cursor-pointer hover-bg-primary-50 text-primary-600 fw-bold"
                    onMouseDown={() => { setSelectedProjectId(""); setProjectSearchTerm(""); setCurrentPage(1); }}>
                  All Projects
                </li>
                {filteredProjectOptions.map(p => (
                  <li key={p.id || p._id} className="p-10 border-bottom cursor-pointer hover-bg-primary-50"
                      onMouseDown={() => {
                        setSelectedProjectId(p.id || p._id);
                        setProjectSearchTerm(p.projectName);
                        setCurrentPage(1);
                      }}>
                    <div className="fw-medium text-sm">{p.projectName}</div>
                    <small className="text-muted">{p.customerName}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-lg-4">
            <label className="form-label text-sm fw-semibold">From Date</label>
            <input type="date" className="form-control radius-8 h-40-px" onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="col-lg-4">
            <label className="form-label text-sm fw-semibold">To Date</label>
            <input type="date" className="form-control radius-8 h-40-px" onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th className="text-sm">Customer Details</th>
                <th className="text-sm">Project & Mode</th>
                <th className="text-sm">Total Budget</th>
                <th className="text-sm">Payment Amount</th>
                <th className="text-sm">Status</th>
                <th className="text-sm text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-secondary-light">{item.customerName}</span>
                        <span className="text-xs text-muted">Cust ID: {item.customerId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <h6 className="text-sm mb-0">{item.projectName}</h6>
                        <span className="text-xs text-uppercase fw-bold text-primary-600">{item.paymentMode}</span>
                      </div>
                    </td>
                    <td className="fw-semibold text-secondary-light">{formatCurrency(item.budget)}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="text-success-600 fw-bold">{formatCurrency(item.amount)}</span>
                        <small className="text-muted" style={{fontSize: '10px'}}>Stage Goal: {formatCurrency(item.stage_amount)}</small>
                      </div>
                    </td>
                    <td>
                     <Link to={`/projects/${item.projectId}?mode=view`}>
                      <span className={`px-12 py-4 radius-4 fw-bold text-xxs text-uppercase border ${
                        item.status === 'paid' ? 'bg-success-50 text-success-600 border-success-100' : 'bg-warning-50 text-warning-600 border-warning-100'
                      }`}>
                        {item.status}
                      </span>
                        </Link>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-neutral-200 text-neutral-600 border border-neutral-400 px-12 py-6 radius-8">
                        {item.formattedDate || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <Icon icon="solar:document-text-outline" className="display-4 text-neutral-300" />
                    <p className="text-secondary-light mt-2">No payment collection records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportLayer;