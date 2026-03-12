import "./CustomerDashboard.css";
import { BiFontColor } from "react-icons/bi";
import CountUp from "react-countup";
import { MdMargin } from "react-icons/md";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/userService1"; 
import Policies from '../components/Policies';

export default function CustomerDashboard() {
 const [activeTab, setActiveTab] = useState("dashboard");
const [selectedPolicy, setSelectedPolicy] = useState(null);

  const renderContent = () => {
  switch (activeTab) {
    case "policies":
  return <Policies />;
    case "claims":
      return <Claims />;
    case "billing":
      return <Billing />;
    case "profile":
      return <Profile />;
    default:
      return <DashboardHome />;
  }
};

  return (
    <div className="dash-container">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h2 className="logo">InsureAI</h2>

        <ul className="menu">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            🏠 Dashboard
          </li>

          <li
            className={activeTab === "policies" ? "active" : ""}
            onClick={() => setActiveTab("policies")}
          >
            📄 Policies
          </li>

          <li
            className={activeTab === "claims" ? "active" : ""}
            onClick={() => setActiveTab("claims")}
          >
            📢 Claims
          </li>

          <li
            className={activeTab === "billing" ? "active" : ""}
            onClick={() => setActiveTab("billing")}
          >
            💳 Billing
          </li>

          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile Info
          </li>
        </ul>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main">{renderContent()}
        <PolicyDetails
  policy={selectedPolicy}
  onClose={() => setSelectedPolicy(null)}
/>
      </main>
    </div>
  );
}


function DashboardHome() {
  return (
    <>
      <div className="topbar">
        <h2>Good Evening, Aniket 👋</h2>
        <div className="top-actions">
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      {/* PREMIUM KPI */}
      <div className="kpi-grid">
        <KpiCard title="Active Policies" value={2} color="blue" />
        <KpiCard title="Claims Approved" value={1} color="green" />
        <KpiCard title="Premium Paid" value={18300} prefix="₹" color="purple" />
        <KpiCard title="Risk Score" value={82} suffix="%" color="orange" />
      </div>

      {/* SMART INSIGHTS */}
      <div className="insight-grid">
        <div className="glass-card">
          <h3>🧠 AI Insight</h3>
          <p>
            Your health policy coverage is under-utilized. Consider upgrading
            to maximize tax benefits.
          </p>
        </div>

        <div className="glass-card">
          <h3>⚡ Quick Actions</h3>
          <div className="chip-center">
            <button className="chip-btn">Renew Policy</button>
            <button className="chip-btn">File Claim</button>
            <button className="chip-btn">Download Receipt</button>
          </div>
        </div>
      </div>

      {/* ACTIVITY FEED */}
      <div className="activity-card ultra">
        <h3>Live Activity</h3>

        <div className="timeline">
          <div className="time-item">
            <span className="dot green"></span>
            Health policy renewed successfully
            <small>2 hrs ago</small>
          </div>

          <div className="time-item">
            <span className="dot yellow"></span>
            Claim under review
            <small>1 day ago</small>
          </div>

          <div className="time-item">
            <span className="dot blue"></span>
            Profile KYC verified
            <small>3 days ago</small>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({ title, value, prefix = "", suffix = "", color }) {
  return (
    <div className={`kpi-card ultra ${color}`}>
      <p>{title}</p>
      <h2>
        {prefix}
        <CountUp end={value} duration={1.5} />
        {suffix}
      </h2>
      <span className="trend-up">▲ Growing</span>
    </div>
  );
}

function Claims() {
  return (
    <div className="section">
      <h2>Claims Center</h2>

      {/* SUMMARY CARDS */}
      <div className="claims-summary">
        <div className="claim-stat approved">
          <p>Approved</p>
          <h3>1</h3>
        </div>

        <div className="claim-stat pending">
          <p>Under Review</p>
          <h3>1</h3>
        </div>

        <div className="claim-stat rejected">
          <p>Rejected</p>
          <h3>0</h3>
        </div>
      </div>

      {/* CLAIMS LIST */}
      <div className="claims-list">
        <div className="claim-card modern">
          <div className="claim-head">
            <div>
              <h4>Health Insurance Claim</h4>
              <p>CLM-1023 • ₹45,000</p>
            </div>
            <span className="badge pending">Under Review</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill yellow"
              style={{ width: "60%" }}
            ></div>
          </div>

          <small>Processing stage: Document Verification</small>
        </div>

        <div className="claim-card modern">
          <div className="claim-head">
            <div>
              <h4>Car Insurance Claim</h4>
              <p>CLM-8871 • ₹12,500</p>
            </div>
            <span className="badge active">Approved</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill green"
              style={{ width: "100%" }}
            ></div>
          </div>

          <small>Amount credited to your account</small>
        </div>
      </div>
    </div>
  );
}
function Billing() {
  return (
    <div className="section">
      <h2>Billing & Payments</h2>

      {/* BILLING KPIs */}
      <div className="billing-kpi">
        <div className="billing-card gradient">
          <p>Next Premium Due</p>
          <h2>₹2,450</h2>
          <span>25 Mar 2026</span>
        </div>

        <div className="billing-card">
          <p>Total Paid (FY)</p>
          <h2>₹18,300</h2>
          <span>On track 👍</span>
        </div>

        <div className="billing-card">
          <p>Auto-Pay</p>
          <h2>Enabled</h2>
          <span>UPI • ****4321</span>
        </div>
      </div>

      {/* PAYMENT HISTORY */}
      <div className="table-card">
        <h3 className="subheading">Recent Payments</h3>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Policy</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>12 Feb 2026</td>
              <td>Health</td>
              <td>UPI</td>
              <td>₹5,200</td>
              <td>
                <span className="badge active">Paid</span>
              </td>
            </tr>

            <tr>
              <td>05 Jan 2026</td>
              <td>Car</td>
              <td>Card</td>
              <td>₹8,400</td>
              <td>
                <span className="badge active">Paid</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Profile() {
  const [user, setUser]     = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then(data => {
        console.log("Profile loaded:", data); // ← debug
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Profile error:", err);
        setError("Failed to load profile. Please login again.");
        setLoading(false);
      });
  }, []);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric"
    });
  };

  // ── STATES ──────────────────────────────
  if (loading) return (
    <div className="page-wrap">
      <h2 className="page-title">Profile Information</h2>
      <p>⏳ Loading your profile...</p>
    </div>
  );

  if (error) return (
    <div className="page-wrap">
      <h2 className="page-title">Profile Information</h2>
      <p style={{ color: "red" }}>❌ {error}</p>
    </div>
  );

  if (!user) return (
    <div className="page-wrap">
      <p>No user data found.</p>
    </div>
  );

  // ── ACTUAL PROFILE UI ────────────────────
  return (
    <div className="page-wrap">
      <h2 className="page-title">Profile Information</h2>

      <div className="profile-grid">

        {/* LEFT CARD */}
        <div className="profile-card glass">
          <div className="avatar-wrap">
            <div className="avatar">{getInitials(user.fullName)}</div>
            <h3>{user.fullName}</h3>
            <span className="verified">✔ {user.role}</span>
          </div>
          <div className="profile-actions">
            <button className="primary-btn">Edit Profile</button>
            <button className="ghost-btn">Upload Photo</button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="details-card glass">
          <h3>Personal Details</h3>
          <div className="details-grid">
            <div>
              <span>Full Name</span>
              <strong>{user.fullName}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>+91 {user.phone}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{user.role}</strong>
            </div>
            <div>
              <span>Member Since</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>
            <div>
              <span>KYC Status</span>
              <strong className="kyc-ok">Completed</strong>
            </div>
          </div>

          <div className="security-box">
            <h4>🔐 Security</h4>
            <button className="ghost-btn">Change Password</button>
            <button className="ghost-btn">Enable 2FA</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function PolicyDetails({ policy, onClose }) {
  if (!policy) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{policy.name}</h2>

        <p><strong>Policy Number:</strong> {policy.number}</p>
        <p><strong>Start Date:</strong> {policy.start}</p>
        <p><strong>Premium:</strong> {policy.premium}</p>
        <p><strong>Coverage:</strong> {policy.coverage}</p>
        <p><strong>Status:</strong> {policy.status}</p>

        <button className="primary-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}