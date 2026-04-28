import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";

/** * PREMIUM STYLES
 * High-performance CSS for mobile responsiveness and UI animations
 */
const treasuryStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .treasury-wrapper {
    font-family: 'Inter', sans-serif;
    background: #f8fafc;
    min-height: 100vh;
  }

  /* Responsive Audit Table */
  @media (max-width: 768px) {
    .responsive-audit-table thead {
      display: none;
    }
    .responsive-audit-table tr {
      display: block;
      padding: 1.25rem 0.75rem;
      border-bottom: 8px solid #f8fafc !important;
      background: #fff;
      border-radius: 16px;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(148,163,184,0.08);
    }
    .responsive-audit-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: none !important;
      padding: 0.6rem 1rem !important;
      text-align: right;
    }
    .responsive-audit-table td::before {
      content: attr(data-label);
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      color: #94a3b8;
      flex-shrink: 0;
      margin-right: 1rem;
      text-align: left;
    }
    .responsive-audit-table td:last-child {
        background: #f0fdf4;
        border-radius: 10px;
        margin-top: 0.5rem;
    }
  }

  .form-control:focus {
    box-shadow: none;
    background: #fff !important;
    border: 1px solid #5B8EF0 !important;
  }

  .btn-deposit:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    transition: all 0.2s ease;
  }

  .btn-deposit:active {
    transform: translateY(0);
  }
`;

const heroCardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "20px",
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(148,163,184,0.06)"
};

const CornerGradient = () => (
  <div style={{
    position: "absolute", top: -20, right: -20,
    width: 80, height: 80, borderRadius: "50%",
    background: "conic-gradient(from 180deg at 50% 50%, #EEF3FE 0deg, #5B8EF0 180deg, #22C4A0 360deg)",
    opacity: 0.15, filter: "blur(12px)",
    zIndex: 0
  }} />
);

const SOURCE_COLORS = {
  "Union Bank": { primary: "#5B8EF0", light: "#EEF3FE", text: "#2C4CA0" },
  "Indus Bank": { primary: "#22C4A0", light: "#E4FBF5", text: "#0B7A62" },
  "Cash Account": { primary: "#F08050", light: "#FEF0EA", text: "#943010" },
};

const VALID_SOURCES = Object.keys(SOURCE_COLORS);

// --- HELPER COMPONENTS ---

function StatPill({ label, value, accent }) {
  return (
    <div className="flex-fill" style={heroCardStyle}>
      <CornerGradient />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 800 }}>
          {label}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{value}</div>
      </div>
    </div>
  );
}

function SourceBadge({ source }) {
  const c = SOURCE_COLORS[source] || { primary: "#94a3b8", light: "#f1f5f9", text: "#475569" };
  return (
    <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, background: c.light, color: c.text, letterSpacing: "0.02em", textTransform: 'uppercase' }}>
      {source}
    </span>
  );
}

// --- MAIN COMPONENT ---

const TreasuryLayer = () => {
  const today = new Date().toISOString().split('T')[0];
  const [data, setData] = useState({ totalBalance: 0, recentLogs: [] });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    amount: "", 
    source: "Union Bank", 
    beneficiary: "", 
    description: "",
    date: today 
  });

  const fetchTreasuryStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get("/treasury/status");
      setData(res.data);
    } catch (err) {
      console.error("Treasury fetch error:", err);
      toast.error("Could not sync treasury data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuryStatus();
  }, []);

  const handleTopUp = async () => {
    const submissionDate = form.date || today;

    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!form.beneficiary.trim()) {
      toast.error("Please enter a beneficiary name");
      return;
    }

    const action = api.post("/treasury/add-funds", {
      amount: Number(form.amount),
      source: form.source,
      beneficiary: form.beneficiary,
      description: form.description,
      date: submissionDate
    });

    toast.promise(action, {
      loading: "Syncing records...",
      success: () => {
        setForm({ ...form, amount: "", beneficiary: "", description: "", date: today });
        fetchTreasuryStatus();
        return <b>Balance Updated!</b>;
      },
      error: <b>Transaction Failed.</b>,
    });
  };

  const totalDeposits = data.recentLogs.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const selectedColor = SOURCE_COLORS[form.source];

  return (
    <div className="treasury-wrapper py-4">
      <style>{treasuryStyles}</style>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="container">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4 gap-3">
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Finance Module
            </div>
            <h1 className="h5 fw-bold m-0" style={{ color: "#0f172a" }}>Treasury Overview</h1>
          </div>
          <div className="p-3 rounded-4" style={{ background: "#EEF3FE", border: '1px solid #d0e0fc' }}>
            <Icon icon="solar:bank-bold-duotone" width="28" style={{ color: "#5B8EF0" }} />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="row g-2 g-md-3 mb-4">
          <div className="col-6 col-md-3 d-flex">
            <StatPill label="Available Balance" value={`₹${data.totalBalance.toLocaleString("en-IN")}`} accent="#22c55e" />
          </div>
          <div className="col-6 col-md-3 d-flex">
            <StatPill label="Total Deposited" value={`₹${totalDeposits.toLocaleString("en-IN")}`} accent="#5B8EF0" />
          </div>
          <div className="col-6 col-md-3 d-flex">
            <StatPill label="Total Logs" value={data.recentLogs.length} accent="#f59e0b" />
          </div>
          <div className="col-6 col-md-3 d-flex">
            <StatPill label="Status" value={loading ? "Syncing..." : "Verified ✓"} accent="#22C4A0" />
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Data Display */}
          <div className="col-12 col-lg-8 order-2 order-lg-1">
            
            {/* Primary Balance Hero */}
            <div className="mb-4" style={{
              background: "#fff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 40px rgba(148, 163, 184, 0.08)",
              padding: "2.5rem 2rem",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
                background: "conic-gradient(from 180deg at 50% 50%, #EEF3FE 0deg, #5B8EF0 180deg, #22C4A0 360deg)",
                opacity: 0.2, filter: "blur(15px)"
              }}/>

              <div className="row align-items-center" style={{ position: 'relative', zIndex: 1 }}>
                <div className="col-12 col-md-5 mb-4 mb-md-0 border-end-md border-light">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-4" style={{ background: "#EEF3FE", border: "1px solid #d0e0fc" }}>
                      <Icon icon="solar:safe-2-bold-duotone" width="32" style={{ color: "#5B8EF0" }} />
                    </div>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Aggregate Holdings
                      </span>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", marginTop: 2 }}>
                        ₹{data.totalBalance.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-7 ps-md-4">
                  <div className="row g-2 g-md-2">
                    {VALID_SOURCES.map((src) => {
                      const c = SOURCE_COLORS[src];
                      const srcTotal = data.recentLogs
                        .filter((l) => l.source === src)
                        .reduce((s, l) => s + (Number(l.amount) || 0), 0);

                      return (
                        <div key={src} className="col-12 col-md-4">
                          <div className="h-100 p-3" style={{
                            background: "rgba(241, 245, 249, 0.4)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "16px",
                            border: `1px solid ${c.light}`,
                            display: "flex", flexDirection: "column", justifyContent: "center"
                          }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.primary }} />
                                <div style={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                                  {src.replace(" Account", "")}
                                </div>
                            </div>
                            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
                              ₹{srcTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail Table */}
            <div style={{ ...heroCardStyle, padding: 0 }}>
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#94a3b8", letterSpacing: '0.05em' }}>
                  Recent Deposits
                </span>
                <span className="badge rounded-pill" style={{ background: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: 700 }}>
                  Showing last 10
                </span>
              </div>

              <div className="table-responsive" style={{ position: 'relative', zIndex: 1 }}>
                <table className="table table-hover align-middle mb-0 responsive-audit-table">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4 py-3" style={{ fontSize: 10, color: "#94a3b8", border: 0, fontWeight: 800 }}>DATE</th>
                      <th className="py-3" style={{ fontSize: 10, color: "#94a3b8", border: 0, fontWeight: 800 }}>SOURCE</th>
                      <th className="py-3" style={{ fontSize: 10, color: "#94a3b8", border: 0, fontWeight: 800 }}>BENEFICIARY</th>
                      <th className="py-3" style={{ fontSize: 10, color: "#94a3b8", border: 0, fontWeight: 800 }}>NOTE</th>
                      <th className="pe-4 py-3 text-end" style={{ fontSize: 10, color: "#94a3b8", border: 0, fontWeight: 800 }}>CREDIT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-5 text-muted small">Syncing records...</td></tr>
                    ) : data.recentLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                           <Icon icon="solar:document-add-bold-duotone" width="40" className="mb-2 opacity-25" />
                           <p className="small mb-0">No transaction records found.</p>
                        </td>
                      </tr>
                    ) : (
                      [...data.recentLogs]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 10)
                        .map((log) => (
                          <tr key={log._id}>
                            <td className="ps-4" data-label="Date" style={{ fontSize: 13, fontWeight: 600 }}>
                              {new Date(log.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td data-label="Source"><SourceBadge source={log.source} /></td>
                            <td data-label="Beneficiary">
                              {log.beneficiary ? (
                                <div className="d-flex align-items-center gap-2 justify-content-end justify-content-md-start">
                                  <div style={{
                                    width: 24, height: 24, borderRadius: "50%",
                                    background: (SOURCE_COLORS[log.source] || {}).light || "#f1f5f9",
                                    color: (SOURCE_COLORS[log.source] || {}).text || "#475569",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 9, fontWeight: 800, flexShrink: 0,
                                  }}>
                                    {log.beneficiary.charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{log.beneficiary}</span>
                                </div>
                              ) : <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>}
                            </td>
                            <td data-label="Memo" style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{log.description || "—"}</td>
                            <td className="pe-4 text-end" data-label="Credit" style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>
                              +₹{Number(log.amount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Transaction Form */}
          <div className="col-12 col-lg-4 order-1 order-lg-2">
            <div style={heroCardStyle}>
              <CornerGradient />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="fw-bold mb-4" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fund Injection</div>
                
                {/* MANUAL DATE FIELD */}
                <div className="mb-3">
                  <label className="small fw-bold text-secondary mb-1 d-block" style={{ fontSize: 10 }}>TRANSACTION DATE</label>
                  <div className="position-relative">
                    <input 
                      type="date" className="form-control border-0 bg-light" 
                      style={{ borderRadius: 12, padding: '12px 12px 12px 2.4rem', fontSize: 14 }}
                      value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <Icon icon="solar:calendar-bold-duotone" width="16" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold text-secondary mb-1 d-block" style={{ fontSize: 10 }}>AMOUNT (₹)</label>
                  <input
                    type="number" className="form-control border-0 bg-light" placeholder="0.00"
                    style={{ borderRadius: 12, padding: '12px' }} value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="small fw-bold text-secondary mb-2 d-block" style={{ fontSize: 10 }}>DEPOSIT SOURCE</label>
                  <div className="d-flex flex-column gap-2">
                    {VALID_SOURCES.map((src) => {
                      const sel = form.source === src;
                      const c = SOURCE_COLORS[src];
                      return (
                        <button key={src} type="button" className="btn btn-sm text-start fw-bold border-2"
                          onClick={() => setForm({ ...form, source: src })}
                          style={{
                            borderRadius: 12, padding: "12px 14px",
                            borderColor: sel ? c.primary : "transparent",
                            backgroundColor: sel ? c.light : "#f8fafc",
                            color: sel ? c.text : "#64748b",
                            fontSize: 12, transition: "all 0.2s"
                          }}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: sel ? c.primary : "#cbd5e1" }} />
                            {src}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold mb-1 d-block" style={{ color: selectedColor?.text || "#64748b", fontSize: 10 }}>BENEFICIARY</label>
                  <div className="position-relative">
                    <input type="text" className="form-control border-0" placeholder="Enter name"
                      style={{ 
                        borderRadius: 12, fontSize: 14, 
                        backgroundColor: selectedColor?.light || "#f8fafc", 
                        color: selectedColor?.text || "#1e293b", 
                        padding: '12px 12px 12px 2.4rem' 
                      }}
                      value={form.beneficiary} onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
                    />
                    <Icon icon="solar:user-bold-duotone" width="16" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: selectedColor?.primary || "#94a3b8" }} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="small fw-bold text-secondary mb-1 d-block" style={{ fontSize: 10 }}>NOTE / MEMO</label>
                  <input type="text" className="form-control border-0 bg-light" placeholder="What is this for?"
                    style={{ borderRadius: 12, fontSize: 14, padding: '12px' }} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <button className="btn btn-deposit w-100 py-3 my-3 fw-bold text-white shadow-sm" onClick={handleTopUp}
                  style={{ backgroundColor: "#ea8b0c", borderRadius: 14, border: "none", fontSize: 14 }}>
                  Confirm Deposit
                </button>

                {/* Analytical Breakdown */}
                <div className="pt-4 border-top">
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: '1px' }} className="mb-3">Source Breakdown</div>
                  {VALID_SOURCES.map((src) => {
                    const c = SOURCE_COLORS[src];
                    const srcTotal = data.recentLogs.filter((l) => l.source === src).reduce((s, l) => s + (Number(l.amount) || 0), 0);
                    const pct = totalDeposits > 0 ? (srcTotal / totalDeposits) * 100 : 0;
                    return (
                      <div key={src} className="mb-3">
                        <div className="d-flex justify-content-between fw-bold mb-1" style={{ fontSize: 12 }}>
                          <span style={{ color: "#64748b" }}>{src}</span>
                          <span style={{ color: c.text }}>₹{srcTotal.toLocaleString()}</span>
                        </div>
                        <div className="progress" style={{ height: 6, background: "#f1f5f9", borderRadius: 10 }}>
                          <div className="progress-bar rounded-pill" style={{ width: `${pct}%`, backgroundColor: c.primary, transition: 'width 1s ease-in-out' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryLayer;