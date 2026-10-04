import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import HowItWorks from "./components/HowItWorks";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </div>
  );
}

export default App;