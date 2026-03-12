import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [role, setRole]         = useState("customer");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ── debug log ──
    console.log("Sending login data:", {
      email, password,
      role: role.toUpperCase()
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          email:    email,
          password: password,
          role:     role.toUpperCase(),
        }
      );

      const data = response.data;
      console.log("Login success:", data);

      // ── save to localStorage ──
      localStorage.setItem("userId",    String(data.userId));
      localStorage.setItem("userRole",  data.role.toLowerCase());
      localStorage.setItem("userName",  data.fullName);
      localStorage.setItem("userEmail", data.email);

      alert(`Welcome ${data.fullName}!`);

      // ── redirect by role ──
      if (role === "agent")       navigate("/agent-dashboard");
      else if (role === "admin")  navigate("/admin-dashboard");
      else                        navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed! Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>InsureAI 🔐</h2>
        <p>Smart insurance starts here</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "🚀 Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}