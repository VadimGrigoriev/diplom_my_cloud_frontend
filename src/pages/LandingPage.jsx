import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LandingHeader from "../components/Landing/LandingHeader";
import HeroSection from "../components/Landing/HeroSection";
import FeaturesSection from "../components/Landing/FeaturesSection";
import LandingFooter from "../components/Landing/LandingFooter";

function LandingPage() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth); // Проверка авторизации

  const handleStart = () => {
    if (accessToken) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <LandingHeader />

      {/* Main content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <HeroSection onStart={handleStart} />

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
