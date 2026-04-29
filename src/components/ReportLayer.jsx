import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import { deleteEntry, updateEntry } from "../features/expense/expenseService"; // Ensure these are exported from your service

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
  const dispatch = useDispatch();

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
  
  // Modal State
  const [editModal, setEditModal] = useState({ show: false, data: null });

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // 3. Fetch Treasury Data
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

  useEffect(() => {
    fetchTreasury();
  }, []);

  // 4. Action Handlers
const handleDelete = (id, type) => {
  toast((t) => (
    <div className="d-flex align-items-center gap-3">
      <div>
        <div className="fw-bold text-sm" style={{ color: '#0f172a' }}>Confirm Delete?</div>
        <div className="text-xxs text-muted">This action cannot be undone.</div>
      </div>
      <div className="d-flex gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="btn btn-light btn-sm radius-8 py-1 px-3 border text-xs fw-bold"
        >
          No
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            dispatch(deleteEntry(id, type)).then(() => fetchTreasury());
          }}
          className="btn btn-danger btn-sm radius-8 py-1 px-2 text-xs fw-bold"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  ), {
    id: "confirm-delete-action",
    duration: 6000,
    style: {
      minWidth: '300px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  });
};

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    if (editModal.data.type === 'OUTGOING') {
        updatedData.item = updatedData.entity;
        updatedData.paid_by = updatedData.payer;
    }

    dispatch(updateEntry(editModal.data.id, editModal.data.type, updatedData))
      .then(() => {
        setEditModal({ show: false, data: null });
        fetchTreasury();
      });
  };

  // 5. Combine Redux data + Treasury Logs into a unified stream
  const combinedData = useMemo(() => {
    const payments = paymentsData || []; 
    const expenses = expensesData || []; 
    const treasury = treasuryLogs || [];

    const incoming = payments.map((p) => ({
      id: p._id || p.id,
      date: p.payment_date ? p.payment_date.split("T")[0] : "",
      entity: p.customerName || "Project Payment",
      description: p.projectName || "Incoming",
      type: "INCOMING",
      payer: "Company",
      amount: Number(p.amount) || 0,
      isProject: true 
    }));

    const capitalInjections = treasury.map((log) => ({
      id: log._id || log.id,
      date: log.date ? log.date.split("T")[0] : "",
      entity: log.beneficiary || "Capital Injection",
      description: `${log.source} ${log.description ? `— ${log.description}` : ""}`,
      type: "INCOMING",
      payer: log.source,
      amount: Number(log.amount) || 0,
      rawDescription: log.description
    }));

    const outgoing = expenses.map((e) => ({
      id: e._id || e.id,
      date: e.created_at ? e.created_at.split("T")[0] : "",
      entity: e.item || "Expense",
      description: e.paid_by || "Member",
      type: "OUTGOING",
      payer: e.paid_by,
      amount: Number(e.amount) || 0,
    }));

    return [...incoming, ...capitalInjections, ...outgoing].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [paymentsData, expensesData, treasuryLogs]);

  // 6. Apply UI Filters
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
<div className="table-responsive" style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e8edf4', boxShadow: '0 2px 12px rgba(15,23,42,0.06)' }}>
  <table className="table align-middle responsive-report-table mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
    <thead>
      <tr style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e8edf4 100%)' }}>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 16px 14px 24px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Timeline</th>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase' }}>Entity</th>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase' }}>Reference</th>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase' }}>Status</th>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 16px', borderBottom: '2px solid #e2e8f0', textAlign: 'right', textTransform: 'uppercase' }}>Transaction</th>
        <th style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '14px 24px 14px 16px', borderBottom: '2px solid #e2e8f0', textAlign: 'center', textTransform: 'uppercase' }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center', padding: '56px 0', color: '#94a3b8', fontSize: 13 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#5B8EF0', animation: 'spin 0.8s linear infinite' }} />
              Synchronizing Ledger...
            </div>
          </td>
        </tr>
      ) : reportData.map((item, idx) => {
        const isIncoming = item.type === 'INCOMING';
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#fafbfd';
        return (
          <tr
            key={item.id}
            style={{ background: rowBg, transition: 'background 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
            onMouseLeave={e => e.currentTarget.style.background = rowBg}
          >
            {/* Date */}
            <td data-label="Date" style={{ padding: '14px 16px 14px 24px', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: isIncoming ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${isIncoming ? '#86efac' : '#fca5a5'}`
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isIncoming ? '#16a34a' : '#dc2626', lineHeight: 1 }}>
                    {new Date(item.date).toLocaleDateString("en-IN", { day: '2-digit' })}
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: isIncoming ? '#15803d' : '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {new Date(item.date).toLocaleDateString("en-IN", { month: 'short' })}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                  {new Date(item.date).getFullYear()}
                </span>
              </div>
            </td>

            {/* Entity Column (New Split) */}
            <td data-label="Entity" style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: isIncoming ? '#f0fdf4' : '#fff1f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${isIncoming ? '#dcfce7' : '#fee2e2'}`
                    }}>
                        <Icon 
                            icon={isIncoming ? "solar:user-rounded-bold-duotone" : "solar:shop-bold-duotone"} 
                            width="16" 
                            style={{ color: isIncoming ? '#16a34a' : '#ef4444' }} 
                        />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {item.entity}
                    </span>
                </div>
            </td>

            {/* Reference Column (New Split) */}
            <td data-label="Reference" style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ 
                    fontSize: '10px', 
                    color: '#64748b', 
                    fontWeight: 600,
                    background: '#f1f5f9',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    <Icon icon="lucide:info" width="10" />
                    {item.description}
                </div>
            </td>

            {/* Status Badge */}
            <td data-label="Type" style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: isIncoming ? '#dcfce7' : '#fee2e2',
                color: isIncoming ? '#15803d' : '#dc2626',
                border: `1px solid ${isIncoming ? '#86efac' : '#fca5a5'}`
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: isIncoming ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
                {isIncoming ? 'Received' : 'Spent'}
              </span>
            </td>

            {/* Amount */}
            <td data-label="Amount" style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: isIncoming ? '#16a34a' : '#dc2626', letterSpacing: '-0.3px' }}>
                {isIncoming ? '+' : '−'}&nbsp;₹{item.amount.toLocaleString("en-IN")}
              </div>
            </td>

            {/* Actions */}
            <td data-label="Actions" style={{ padding: '14px 24px 14px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
              {!item.isProject ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                  <button
                    onClick={() => setEditModal({ show: true, data: item })}
                    title="Edit"
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid #dbeafe',
                      background: '#eff6ff', color: '#3b82f6', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#3b82f6'; }}
                  >
                    <Icon icon="lucide:edit-3" width="13" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.type)}
                    title="Delete"
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: '1px solid #fee2e2',
                      background: '#fff1f2', color: '#ef4444', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.color = '#ef4444'; }}
                  >
                    <Icon icon="lucide:trash-2" width="13" />
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  🔒 Locked
                </span>
              )}
            </td>
          </tr>
        );
      })}
      {!loading && reportData.length === 0 && (
        <tr>
          <td colSpan="6" style={{ textAlign: 'center', padding: '64px 0' }}>
            <Icon icon="solar:document-text-broken" width="44" style={{ color: '#cbd5e1', display: 'block', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>No records match your selection.</div>
            <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>Try adjusting your filters</div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.show && (
        <div className="modal d-block" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 radius-12 shadow-lg">
              <div className="modal-header border-bottom py-3">
                <h6 className="fw-bold mb-0">Update {editModal.data.type === 'INCOMING' ? 'Treasury' : 'Expense'}</h6>
                <button type="button" className="btn-close" onClick={() => setEditModal({ show: false, data: null })}></button>
              </div>
              <form onSubmit={handleEditSubmit} className="px-3">
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="text-xxs fw-bold text-muted mb-1">PARTICULAR (ITEM / BENEFICIARY)</label>
                    <input name="entity" defaultValue={editModal.data.entity} className="form-control form-control-sm h-40-px radius-8" required />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="text-xxs fw-bold text-muted mb-1">AMOUNT (₹)</label>
                      <input name="amount" type="number" defaultValue={editModal.data.amount} className="form-control form-control-sm h-40-px radius-8" required />
                    </div>
                    <div className="col-6">
                      <label className="text-xxs fw-bold text-muted mb-1">DATE</label>
                      <input name="date" type="date" defaultValue={editModal.data.date} className="form-control form-control-sm h-40-px radius-8" required />
                    </div>
                  </div>
                  
                  {editModal.data.type === 'INCOMING' ? (
                    <>
                      <div className="mb-3">
                        <label className="text-xxs fw-bold text-muted mb-1">SOURCE BANK</label>
                        <select name="source" defaultValue={editModal.data.payer} className="form-select form-select-sm h-40-px radius-8">
                          <option value="Union Bank">Union Bank</option>
                          <option value="Indus Bank">Indus Bank</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="text-xxs fw-bold text-muted mb-1">DESCRIPTION</label>
                        <input name="description" defaultValue={editModal.data.rawDescription} className="form-control form-control-sm h-40-px radius-8" />
                      </div>
                    </>
                  ) : (
                    <div className="mb-3">
                      <label className="text-xxs fw-bold text-muted mb-1">PAID BY</label>
                      <select name="payer" defaultValue={editModal.data.payer} className="form-select form-select-sm h-40-px radius-8">
                        {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 p-3">
                  <button type="button" className="btn btn-light btn-sm px-4 radius-8" onClick={() => setEditModal({ show: false, data: null })}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 radius-8 fw-bold">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportLayer;