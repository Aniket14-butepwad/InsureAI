import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Signup() {
  const [role, setRole]         = useState("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ── debug log — check what we're sending ──
    console.log("Sending signup data:", {
      fullName, email, password, phone,
      role: role.toUpperCase()
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        {
          fullName: fullName,
          email:    email,
          password: password,
          phone:    phone,
          role:     role.toUpperCase(),
        }
      );

      console.log("Signup success:", response.data);
      alert("Signup successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response?.data);
      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Signup failed! Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create Account 🚀</h2>
        <p>Join InsureAI today</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}