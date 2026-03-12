import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { color } from "framer-motion";

export default function Navbar() {
  const [role, setRole] = useState(null);

  // ✅ read role on load
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    setRole(savedRole);
  }, []);

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setRole(null); // VERY IMPORTANT (instant UI update)
  };

  return (
    <nav className="navbar">
       <h2 className="logo" >INSURE<span style={{color:'black'}}>AI</span></h2>

      <div style={{ display: "flex", gap: "12px" }}>
        
        {/* 👤 CUSTOMER DASHBOARD */}
        {role === "customer" && (
          <Link to="/customer-dashboard" className="login-btn">
            Dashboard
          </Link>
        )}

        {/* 🔐 LOGIN (only when not logged in) */}
        {!role && (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}

        {/* 🚪 LOGOUT (when logged in) */}
        {role && (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
