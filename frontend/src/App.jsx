import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import HowItWorks from "./components/HowItWorks";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default App;