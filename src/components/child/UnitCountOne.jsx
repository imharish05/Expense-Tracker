import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

// --- UPDATED IMPORTS ---
import api from "../../api/axios";
import { fetchAllExpenseData, createExpense } from "../../features/expense/expenseService"; // From Service
import { updateRange } from "../../features/expense/expenseSlice"; // From Slice

// Constants & Styles
const USERS = ["Harish", "Sankaran", "Vijay"];
const USER_COLORS = {
  Vijay: { primary: "#5B8EF0", light: "#EEF3FE", text: "#2C4CA0" },
  Sankaran: { primary: "#22C4A0", light: "#E4FBF5", text: "#0B7A62" },
  Harish: { primary: "#F08050", light: "#FEF0EA", text: "#943010" },
};

// Unified Hero Card Style
const heroCardStyle = { 
  background: "#fff", 
  border: "1px solid #e2e8f0", 
  borderRadius: "20px", 
  padding: "1.25rem",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(148,163,184,0.06)"
};

// Reusable Background Gradient
const CornerGradient = () => (
  <div style={{
    position: "absolute", top: -20, right: -20,
    width: 80, height: 80, borderRadius: "50%",
    background: "conic-gradient(from 180deg at 50% 50%, #EEF3FE 0deg, #5B8EF0 180deg, #F08050 360deg)",
    opacity: 0.15, filter: "blur(12px)",
    zIndex: 0
  }} />
);

// ── Sub-Components ──────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (Number(p.value) || 0), 0);
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", fontSize: 13, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 160 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#1e293b", fontSize: 12, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>{label}</div>
      {payload.filter(p => p.dataKey !== "__total").map(p => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 20, color: USER_COLORS[p.name]?.primary || "#888", marginBottom: 4 }}>
          <span style={{ fontWeight: 600 }}>{p.name}</span>
          <span style={{ fontWeight: 700 }}>₹{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#1e293b" }}>
        <span>Total</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

function Avatar({ name, size = 36 }) {
  const c = USER_COLORS[name] || { primary: "#aaa", light: "#eee", text: "#333" };
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: c.light, color: c.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.38, flexShrink: 0 }}>
      {name.charAt(0)}
    </div>
  );
}

function StatPill({ label, value, accent }) {
  return (
    <div className="flex-fill" style={heroCardStyle}>
      <CornerGradient />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{value}</div>
      </div>
    </div>
  );
}

function UserCard({ name, spent, share, added }) {
  const c = USER_COLORS[name];
  const remaining = Math.max(0, added - spent);
  const pieData = [
    { name: "Spent", value: spent },
    { name: "Remaining", value: remaining }
  ];
  const usagePercent = added > 0 ? Math.round((spent / added) * 100) : 0;

  return (
    <div className="flex-fill" style={{ ...heroCardStyle, minWidth: "220px" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Avatar name={name} size={32} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{name}</span>
        </div>
        <div className="d-flex justify-content-center position-relative">
          <PieChart width={85} height={85}>
            <Pie 
              data={pieData} 
              innerRadius={25} 
              outerRadius={38} 
              dataKey="value" 
              startAngle={90} 
              endAngle={-270} 
              strokeWidth={0}
            >
              <Cell fill={c.primary} />
              <Cell fill={c.light} />
            </Pie>
          </PieChart>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '10px', fontWeight: 800, color: c.text
          }}>
            {usagePercent}%
          </div>
        </div>
        <div style={{ fontSize: 12 }} className="mt-2">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>Spent</span>
            <span style={{ fontWeight: 800, color: "#e11d48" }}>₹{spent.toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span style={{ color: "#94a3b8", fontWeight: 600 }}>Added</span>
            <span style={{ fontWeight: 800, color: "#22c55e" }}>₹{added.toLocaleString()}</span>
          </div>
          <div className="py-1 px-2 text-center" style={{ background: c.light, borderRadius: 8, fontSize: 10, color: c.text, fontWeight: 700 }}>
             {usagePercent}% of their funds used
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseGraph({ graphData, range, onRangeChange }) {
  const enriched = graphData.map(d => ({ ...d, __total: USERS.reduce((s, n) => s + (Number(d[n]) || 0), 0) }));

  return (
    <div style={{ ...heroCardStyle, marginBottom: "1.5rem" }}>
      <CornerGradient />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Breakdown</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{range} breakdown · per person</div>
          </div>
          <div className="d-flex p-1 rounded-3 gap-1" style={{ background: "#f1f5f9" }}>
            {["weekly", "monthly", "yearly"].map(r => (
              <button key={r} onClick={() => onRangeChange(r)} className={`btn btn-sm border-0 rounded-2 fw-bold ${range === r ? "bg-white shadow-sm text-dark" : "text-secondary bg-transparent"}`} style={{ fontSize: 10, padding: "4px 12px" }}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={enriched}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} width={50} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.07)" }} />
              {USERS.map(name => (
                <Bar key={name} dataKey={name} fill={USER_COLORS[name].primary} radius={[4, 4, 0, 0]} />
              ))}
              <Line dataKey="__total" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────

export default function UnitCountOne() {
  const dispatch = useDispatch();
  const { transactions, graphData, summary, range } = useSelector((state) => state.expenses);
  
  const [treasuryLogs, setTreasuryLogs] = useState([]);
  const [totalAddedGlobal, setTotalAddedGlobal] = useState(0);
  const [form, setForm] = useState({ item: "", amount: "", paidBy: "Harish" });

  const fetchTreasuryData = async () => {
    try {
      const res = await api.get("/treasury/status");
      setTreasuryLogs(res.data.recentLogs || []);
      const total = res.data.recentLogs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setTotalAddedGlobal(total);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    // UPDATED: Now calling the service function
    dispatch(fetchAllExpenseData(range));
    fetchTreasuryData();
  }, [dispatch, range]);

  const handleAdd = () => {
    if (!form.item.trim() || !form.amount) return toast.error("Fill all fields");
    
    // UPDATED: Now calling createExpense from service
    const action = dispatch(createExpense({ 
      item: form.item, 
      amount: Number(form.amount), 
      paid_by: form.paidBy 
    }));

    toast.promise(action, {
      loading: 'Saving...',
      success: () => { 
        setForm({ ...form, item: "", amount: "" }); 
        return <b>Recorded!</b>; 
      },
      error: <b>Failed.</b>,
    });
  };

  const totalSpent = Object.values(summary).reduce((s, v) => s + (Number(v) || 0), 0);
  const userStats = USERS.map(name => {
    const spent = summary[name] || 0;
    const added = treasuryLogs.filter(log => log.beneficiary?.toLowerCase() === name.toLowerCase()).reduce((s, l) => s + (Number(l.amount) || 0), 0);
    return { name, spent, added, share: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0 };
  });

  return (
    <div className="py-4" style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="container">
        <Toaster position="top-center" />
        
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div className="py-2" style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Financial Control</div>
            <h1 className="h6 fw-bold py-3">Expense Dashboard</h1>
          </div>
          <div className="d-flex gap-1 mt-3">{USERS.map(n => <Avatar key={n} name={n} size={30} />)}</div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3 d-flex"><StatPill label="Total Injected" value={`₹${totalAddedGlobal.toLocaleString()}`} accent="#22c55e" /></div>
          <div className="col-md-3 d-flex"><StatPill label="Total Spent" value={`₹${Math.round(totalSpent).toLocaleString()}`} accent="#e11d48" /></div>
          <div className="col-md-3 d-flex"><StatPill label="Available" value={`₹${Math.round(totalAddedGlobal - totalSpent).toLocaleString()}`} accent="#5B8EF0" /></div>
          <div className="col-md-3 d-flex"><StatPill label="Entries" value={transactions.length} accent="#0f172a" /></div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex gap-3 overflow-auto mb-4" style={{ scrollbarWidth: "none" }}>
              {userStats.map(u => <UserCard key={u.name} {...u} />)}
            </div>
            <ExpenseGraph graphData={graphData} range={range} onRangeChange={(r) => dispatch(updateRange(r))} />
            
            <div style={heroCardStyle}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="fw-bold mb-3" style={{ fontSize: 14, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>Recent Logs</div>
                {transactions.slice(0, 5).map(t => (
                  <div key={t._id} className="d-flex align-items-center gap-3 py-3 border-bottom border-light">
                    <Avatar name={t.paid_by} size={32} />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark text-capitalize" style={{ fontSize: 14 }}>{t.item}</div>
                      <div className="text-muted" style={{ fontSize: 11, fontWeight: 500 }}>{t.paid_by} · {new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="fw-bold" style={{ color: "#e11d48" }}>-₹{t.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div style={heroCardStyle}>
              <CornerGradient />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="fw-bold mb-4" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Transaction</div>
                <div className="mb-3">
                  <input className="form-control border-0 bg-light" style={{ borderRadius: 12, padding: '12px' }} placeholder="Description" value={form.item} onChange={e => setForm({...form, item: e.target.value})} />
                </div>
                <div className="mb-3">
                  <input type="number" className="form-control border-0 bg-light" style={{ borderRadius: 12, padding: '12px' }} placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
                <div className="d-flex gap-2 mb-4">
                  {USERS.map(n => (
                    <button key={n} type="button" className="btn btn-sm flex-fill fw-bold" onClick={() => setForm({...form, paidBy: n})} style={{ background: form.paidBy === n ? USER_COLORS[n].light : "#f8fafc", color: form.paidBy === n ? USER_COLORS[n].text : "#94a3b8", borderRadius: 10, border: form.paidBy === n ? `1px solid ${USER_COLORS[n].primary}` : "1px solid transparent", fontSize: 11 }}>{n}</button>
                  ))}
                </div>
                <button className="btn w-100 py-3 text-white fw-bold my-3" onClick={handleAdd} style={{ background: "#ea8b0c", borderRadius: 14 }}>Save Entry</button>
                
                <div className="mt-4 pt-4 border-top border-light">
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: '1px' }} className="mb-3">Personal Distribution</div>
                  {userStats.map(u => (
                    <div key={u.name} className="mb-3">
                      <div className="d-flex justify-content-between fw-bold mb-1" style={{ fontSize: 13 }}>
                        <span>{u.name}</span>
                        <span>₹{Math.round(u.spent).toLocaleString()}</span>
                      </div>
                      <div className="progress" style={{ height: 6, borderRadius: 10, background: '#f1f5f9' }}>
                        <div className="progress-bar" style={{ width: `${u.share}%`, background: USER_COLORS[u.name].primary }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}