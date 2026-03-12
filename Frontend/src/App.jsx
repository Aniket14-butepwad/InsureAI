import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Stats from "./components/Stats";
import WhyUs from "./Components/Whyus";
import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CustomerDashboard from "./Pages/CustomerDashboard";
import AgentDashboard from "./Pages/AgentDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import ViewPlans from "./Pages/ViewPlans";
import "./App.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <Stats />
      <WhyUs />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/agent-dashboard" element={<AgentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/view-plans" element={<ViewPlans />} />         
      <Route path="/view-plans/:type" element={<ViewPlans />} />
    </Routes>
  );
}
