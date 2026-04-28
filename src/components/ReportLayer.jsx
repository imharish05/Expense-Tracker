import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import api from "../api/axios";
import { Toaster } from "react-hot-toast";

// Config matching for visual harmony
const PAYER_CONFIG = {
  Harish:   { primary: "#F08050", light: "#FEF0EA", text: "#943010" },
  Vijay:    { primary: "#5B8EF0", light: "#EEF3FE", text: "#2C4CA0" },
  Sankaran: { primary: "#22C4A0", light: "#E4FBF5", text: "#0B7A62" },
};
const PAYERS = Object.keys(PAYER_CONFIG);

const mobileTableStyles = `
  @media (max-width: 768px) {
    .responsive-report-table thead { display: none; }
    .responsive-report-table tr {
      display: block;
      padding: 1rem 0.5rem;
      border-bottom: 1px solid #e2e8f0 !important;
      background: #fff;
      margin-bottom: 0.5rem;
      border-radius: 12px;
    }
    .responsive-report-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: none !important;
      padding: 0.5rem 0.75rem !important;
    }
    .responsive-report-table td::before {
      content: attr(data-label);
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      color: #94a3b8;
    }
    .responsive-report-table td:last-child {
        border-top: 1px dashed #f1f5f9 !important;
        margin-top: 0.5rem;
        padding-top: 0.75rem !important;
    }
  }
  .h-40-px { height: 40px; }
  .bg-success-focus { background: #e4fbf5; }
  .bg-danger-focus { background: #fef2f2; }
  .radius-12 { border-radius: 12px; }
  .radius-8 { border-radius: 8px; }
  .text-xxs { font-size: 0.65rem; }
`;

const ReportLayer = () => {
  // 1. Redux Selectors
  const paymentsData = useSelector((state) => state.payments?.payments);
  const expensesData = useSelector((state) => state.expenses?.transactions);
  
  // 2. Local State
  const [treasuryLogs, setTreasuryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [payerFilter, setPayerFilter] = useState("ALL");
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // 3. Fetch Treasury Data
  useEffect(() => {
    const fetchTreasury = async () => {
      try {
        const res = await api.get("/treasury/status");
        setTreasuryLogs(res.data.recentLogs || []);
      } catch (err) {
        console.error("Failed to fetch treasury", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTreasury();
  }, []);

  // 4. Combine Redux data into a unified stream (Dependencies fixed for Netlify)
// 4. Combine Redux data + Treasury Logs into a unified stream
  const combinedData = useMemo(() => {
    const payments = paymentsData || []; 
    const expenses = expensesData || []; 
    const treasury = treasuryLogs || []; // Accessing the local state fetched in useEffect

    // 1. Map Project Payments (Incoming)
    const incoming = payments.map((p) => ({
      id: p._id || p.id,
      date: p.payment_date ? p.payment_date.split("T")[0] : "",
      entity: p.customerName || "Project Payment",
      description: p.projectName || "Incoming",
      type: "INCOMING",
      payer: "Company",
      amount: Number(p.amount) || 0,
    }));

    // 2. Map Treasury Deposits (Incoming - NEW)
    const capitalInjections = treasury.map((log) => ({
      id: log._id || log.id,
      date: log.date ? log.date.split("T")[0] : "",
      entity: log.beneficiary || "Capital Injection",
      description: `Treasury: ${log.source} ${log.description ? `— ${log.description}` : ""}`,
      type: "INCOMING",
      payer: log.source, // Uses "Union Bank", "Indus Bank", etc.
      amount: Number(log.amount) || 0,
    }));

    // 3. Map Expenses (Outgoing)
    const outgoing = expenses.map((e) => ({
      id: e._id || e.id,
      date: e.created_at ? e.created_at.split("T")[0] : "",
      entity: e.item || "Expense",
      description: e.paid_by || "Member",
      type: "OUTGOING",
      payer: e.paid_by,
      amount: Number(e.amount) || 0,
    }));

    // Combine all three and sort by date descending
    return [...incoming, ...capitalInjections, ...outgoing].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [paymentsData, expensesData, treasuryLogs]); // Added treasuryLogs to dependencies
  // 5. Apply UI Filters
  const reportData = useMemo(() => {
    return combinedData.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
                            item.entity.toLowerCase().includes(search) || 
                            item.description.toLowerCase().includes(search);
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      const matchesPayer = payerFilter === "ALL" || item.payer === payerFilter;
      const matchesStartDate = !startDate || item.date >= startDate;
      const matchesEndDate = !endDate || item.date <= endDate;
      return matchesSearch && matchesType && matchesPayer && matchesStartDate && matchesEndDate;
    });
  }, [combinedData, searchTerm, typeFilter, payerFilter, startDate, endDate]);

  // 6. Financial Summary logic
  const totals = useMemo(() => {
    const totalInjected = treasuryLogs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalOut = reportData.reduce((acc, item) => item.type === "OUTGOING" ? acc + item.amount : acc, 0);
    return { in: totalInjected, out: totalOut };
  }, [treasuryLogs, reportData]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setTypeFilter("ALL");
    setPayerFilter("ALL");
    if (startDateRef.current) startDateRef.current.value = "";
    if (endDateRef.current) endDateRef.current.value = "";
  };

  return (
    <div className="container-fluid p-2 p-md-4" style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{mobileTableStyles}</style>
      <Toaster position="top-center" />
      
      <div className="card shadow-sm border-0 radius-12 overflow-hidden">
        
        {/* Header */}
        <div className="card-header bg-white border-bottom py-3 px-3 px-md-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#0f172a' }}>Financial Ledger</h5>
            <p className="text-xs text-muted mb-0">Audited Unified Intelligence</p>
          </div>
          <div className="d-flex gap-2">
             {(searchTerm || startDate || typeFilter !== "ALL" || payerFilter !== "ALL") && (
              <button onClick={handleClearFilters} className="btn btn-outline-danger btn-sm radius-8 py-1 px-3 d-flex align-items-center gap-2" style={{ fontSize: '11px', fontWeight: 600 }}>
                <Icon icon="lucide:refresh-ccw" width="12" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div className="card-body p-3 p-md-4">
          
          {/* --- Hero Card --- */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(148,163,184,0.06)",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
            marginBottom: 24,
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "conic-gradient(from 180deg at 50% 50%, #EEF3FE 0deg, #5B8EF0 180deg, #F08050 360deg)",
              opacity: 0.15, filter: "blur(15px)",
            }} />

            <div className="row align-items-center g-4" style={{ position: 'relative', zIndex: 1 }}>
              <div className="col-12 col-md-5 text-center text-md-start">
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Calculated Net Margin</div>
                <div style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-1.5px" }}>
                  ₹{(totals.in - totals.out).toLocaleString("en-IN")}
                </div>
                <div className="d-flex gap-3 mt-1 justify-content-center justify-content-md-start">
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e" }}>₹{totals.in.toLocaleString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#e11d48" }}>₹{totals.out.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-7">
                <div className="row g-2">
                  {PAYERS.map(name => {
                    const c = PAYER_CONFIG[name];
                    const userSpent = reportData
                      .filter(item => item.payer === name && item.type === "OUTGOING")
                      .reduce((acc, curr) => acc + curr.amount, 0);
                    const pct = totals.out > 0 ? Math.min(Math.round((userSpent / totals.out) * 100), 100) : 0;

                    return (
                      <div key={name} className="col-4">
                        <div style={{
                          padding: "12px 10px",
                          background: "rgba(248,250,252,0.8)",
                          borderRadius: 14,
                          border: `1px solid ${c.light}`,
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>{name}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                              ₹{userSpent > 9999 ? (userSpent/1000).toFixed(1)+'k' : userSpent.toLocaleString()}
                          </div>
                          <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: c.primary, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="row g-2 g-md-3 mb-4 align-items-end p-3 bg-light radius-12 mx-0 shadow-sm border">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label text-xs fw-bold text-muted">SEARCH</label>
              <div className="position-relative">
                <Icon icon="lucide:search" className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
                <input type="text" className="form-control form-control-sm h-40-px radius-8 " placeholder="Action or item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label text-xs fw-bold text-muted">CATEGORY</label>
              <select className="form-select form-select-sm h-40-px radius-8 fw-600" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="ALL">All Flows</option>
                <option value="INCOMING">Cash In</option>
                <option value="OUTGOING">Cash Out</option>
              </select>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label text-xs fw-bold text-muted">OWNER</label>
              <select className="form-select form-select-sm h-40-px radius-8 fw-600" value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)}>
                <option value="ALL">All Members</option>
                {PAYERS.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="col-6 col-lg-2">
              <label className="form-label text-xs fw-bold text-muted">START DATE</label>
              <input ref={startDateRef} type="date" className="form-control form-control-sm h-40-px radius-8" onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-6 col-lg-2">
              <label className="form-label text-xs fw-bold text-muted">END DATE</label>
              <input ref={endDateRef} type="date" className="form-control form-control-sm h-40-px radius-8" onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle responsive-report-table border">
              <thead className="table-light">
                <tr style={{ background: '#f8fafc' }}>
                  <th className="text-xs py-3 ps-4 border-0">TIMELINE</th>
                  <th className="text-xs py-3 border-0">PARTICULARS & REFERENCE</th>
                  <th className="text-xs py-3 border-0">STATUS</th>
                  <th className="text-xs py-3 text-end pe-4 border-0">TRANSACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="4" className="text-center py-5 text-muted small">Synchronizing Ledger...</td></tr>
                ) : reportData.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 text-sm" data-label="Date">
                      <div className="fw-600">{new Date(item.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</div>
                      <div className="text-xxs text-muted">{new Date(item.date).getFullYear()}</div>
                    </td>
                    <td data-label="Particulars">
                      <div className="d-flex flex-column align-items-end align-items-md-start">
                        <span className="fw-bold text-dark text-sm text-capitalize">{item.entity}</span>
                        <span className="text-xs text-muted d-flex align-items-center gap-1">
                            <Icon icon={item.type === 'INCOMING' ? "solar:wallet-bold-duotone" : "solar:user-bold-duotone"} width="12" />
                            {item.payer} — {item.description}
                        </span>
                      </div>
                    </td>
                    <td data-label="Type">
                      <span className={`badge px-2 py-1 radius-4 text-xxs ${item.type === 'INCOMING' ? 'bg-success-focus text-success' : 'bg-danger-focus text-danger'}`}>
                        {item.type === 'INCOMING' ? 'RECEIVED' : 'SPENT'}
                      </span>
                    </td>
                    <td className={`text-end pe-4 fw-bold ${item.type === 'INCOMING' ? 'text-success' : 'text-danger'}`} data-label="Amount">
                      {item.type === 'INCOMING' ? '+' : '-'} ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
                {!loading && reportData.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center py-5">
                          <Icon icon="solar:document-text-broken" width="48" className="text-muted mb-2" />
                          <div className="text-muted small">No records match your selection.</div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLayer;