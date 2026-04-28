import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { fetchAllExpenseData, createExpense } from "../features/expense/expenseService";

// --- Config ---
const PAYER_CONFIG = {
  Harish:   { primary: "#5B8EF0", light: "#EEF3FE", text: "#2C4CA0" },
  Vijay:    { primary: "#22C4A0", light: "#E4FBF5", text: "#0B7A62" },
  Sankaran: { primary: "#F08050", light: "#FEF0EA", text: "#943010" },
};
const PAYERS = Object.keys(PAYER_CONFIG);

const customCardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "1.25rem",
};

// --- Helper Components ---
function Avatar({ name, size = 32 }) {
  const c = PAYER_CONFIG[name] || { light: "#f1f5f9", text: "#475569" };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: c.light, color: c.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
      border: `2px solid #fff`,
    }}>
      {name.charAt(0)}
    </div>
  );
}

function PayerBadge({ name }) {
  const c = PAYER_CONFIG[name] || { primary: "#94a3b8", light: "#f1f5f9", text: "#475569" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.light, padding: "4px 10px", borderRadius: 8 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.primary, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{name}</span>
    </div>
  );
}

const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions = [], summary = {}, isLoading } = useSelector((state) => state.expenses || {});
  
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ 
    item: "", 
    amount: "", 
    paid_by: "Harish",
    date: today 
  });

  // Load data on mount
  useEffect(() => {
    dispatch(fetchAllExpenseData());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item || !form.amount || !form.date) return toast.error("Please enter details");

    try {
      await dispatch(createExpense(form));
      toast.success("Transaction Saved");
      setForm({ item: "", amount: "", paid_by: "Harish", date: today });
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const totalSpent = Object.values(summary).reduce((s, v) => s + Number(v || 0), 0);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      <Toaster position="top-center" />

      {/* --- Navbar --- */}
      <nav style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        position: 'sticky', top: 0,
        zIndex: 1000
      }}>
        <div className="container-fluid" style={{ maxWidth: 1200, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#1e293b", padding: 8, borderRadius: 10 }}>
              <Icon icon="solar:transfer-horizontal-bold-duotone" width="18" color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>Transaction History</div>
              <h1 className="h6 fw-bold m-0">Expenses</h1>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {PAYERS.map((n, i) => (
              <div key={n} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                <Avatar name={n} size={32} />
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4" style={{ maxWidth: 1200 }}>
        
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
            width: 120, height: 120, borderRadius: "50%",
            background: "conic-gradient(from 180deg at 50% 50%, #EEF3FE 0deg, #5B8EF0 180deg, #F08050 360deg)",
            opacity: 0.15, filter: "blur(12px)",
          }} />

          <div className="row align-items-center g-4" style={{ position: 'relative', zIndex: 1 }}>
            <div className="col-12 col-md-4 text-center text-md-start">
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Total Outflow</div>
              <div style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>
                ₹{totalSpent.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="row g-2">
                {PAYERS.map(name => {
                  const c = PAYER_CONFIG[name];
                  const spent = Number(summary[name] || 0);
                  const pct = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
                  return (
                    <div key={name} className="col-4">
                      <div style={{
                        padding: "10px",
                        background: "rgba(241,245,249,0.5)",
                        borderRadius: 14,
                        border: `1px solid ${c.light}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>{name}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>₹{spent > 9999 ? (spent/1000).toFixed(1)+'k' : spent.toLocaleString()}</div>
                        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4, marginTop: 6, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: c.primary }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* --- Activity Log --- */}
          <div className="col-12 col-lg-8 order-2 order-lg-1">
            <div style={{ ...customCardStyle, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Recent Activity</span>
                <span className="badge rounded-pill" style={{ background: '#f1f5f9', color: '#64748b', fontSize: 10 }}>Showing last 10</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      <th style={{ border: 0, fontSize: 11, color: "#94a3b8", padding: "16px 24px" }}>ITEM</th>
                      <th style={{ border: 0, fontSize: 11, color: "#94a3b8", padding: "16px 24px" }}>PAID BY</th>
                      <th className="text-end" style={{ border: 0, fontSize: 11, color: "#94a3b8", padding: "16px 24px" }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="3" className="text-center py-5 text-muted small">Loading records...</td></tr>
                    ) : transactions.length === 0 ? (
                      <tr><td colSpan="3" className="text-center py-5 text-muted small">No transactions found</td></tr>
                    ) : (
                      [...transactions]
                        .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
                        .slice(0, 10)
                        .map(t => (
                          <tr key={t._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "16px 24px" }}>
                              <div style={{ fontSize: 14, fontWeight: 600 }} className="text-capitalize">{t.item}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                {new Date(t.date || t.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <PayerBadge name={t.paid_by} />
                            </td>
                            <td className="text-end" style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: "#E11D48" }}>
                              -₹{Number(t.amount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- Sidebar Form --- */}
          <div className="col-12 col-lg-4 order-1 order-lg-2">
            <div style={customCardStyle}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>New Entry</div>
              <form onSubmit={handleSubmit}>
                
                {/* DATE FIELD */}
                <div className="mb-3">
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Transaction Date</label>
                  <div className="position-relative">
                    <input
                      type="date"
                      className="form-control border-0 bg-light"
                      style={{ borderRadius: 10, padding: '12px 12px 12px 2.5rem', fontSize: 14, color: "#1e293b" }}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <Icon 
                      icon="solar:calendar-bold-duotone" 
                      width="18" 
                      style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Expense Item</label>
                  <input
                    className="form-control border-0 bg-light"
                    placeholder="e.g. Server Hosting"
                    style={{ borderRadius: 10, padding: '12px', fontSize: 14 }}
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: 'uppercase', marginBottom: 4, display: 'block' }}>Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control border-0 bg-light"
                    placeholder="0.00"
                    style={{ borderRadius: 10, padding: '12px', fontSize: 14 }}
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Paid By</label>
                  <div className="d-flex gap-2">
                    {PAYERS.map(name => {
                      const sel = form.paid_by === name;
                      const c = PAYER_CONFIG[name];
                      return (
                        <button
                          key={name}
                          type="button"
                          className="text-center"
                          onClick={() => setForm({ ...form, paid_by: name })}
                          style={{
                            flex: 1, padding: "10px 4px", borderRadius: 10, border: "2px solid",
                            borderColor: sel ? c.primary : "transparent",
                            background: sel ? c.light : "#f1f5f9",
                            color: sel ? c.text : "#64748b",
                            fontSize: 11, fontWeight: 700, transition: "all 0.2s"
                          }}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="my-3 text-center"
                  disabled={isLoading}
                  style={{
                    width: "100%", padding: "14px", background: "#ea8b0c",
                    color: "#fff", border: "none", borderRadius: 12, fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(234, 139, 12, 0.2)"
                  }}
                >
                  {isLoading ? "Saving..." : "Confirm Transaction"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;