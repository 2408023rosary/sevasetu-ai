import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            AI-powered civic reporting
          </div>

          <h1>
            Make your city better,
            <span> one report at a time.</span>
          </h1>

          <p>
            Report civic problems, share their location, and track progress
            from submission to resolution — all in one intelligent platform.
          </p>

          <div className="hero-actions">
            <a href="/register" className="primary-button">
              Report an Issue
              <ArrowRight size={18} />
            </a>

            <a href="#how-it-works" className="secondary-button">
              See How It Works
            </a>
          </div>

          <div className="hero-trust">
            <div>
              <CheckCircle2 size={17} />
              AI-assisted classification
            </div>

            <div>
              <MapPin size={17} />
              Location-aware reporting
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-dashboard-card">
            <div className="mini-dashboard-header">
              <div>
                <span>Complaint Analysis</span>
                <strong>CIV-1042</strong>
              </div>

              <div className="ai-status">
                <Sparkles size={15} />
                AI
              </div>
            </div>

            <div className="complaint-preview">
              <div className="complaint-image">
                <div className="image-placeholder">
                  <MapPin size={30} />
                  <span>Reported Issue</span>
                </div>
              </div>

              <div className="complaint-info">
                <span className="mini-label">Detected category</span>
                <strong>Road Damage</strong>

                <div className="analysis-row">
                  <span>Severity</span>
                  <strong>8/10</strong>
                </div>

                <div className="analysis-row">
                  <span>Priority</span>
                  <span className="high-priority">HIGH</span>
                </div>

                <div className="analysis-progress">
                  <div className="analysis-progress-bar" />
                </div>
              </div>
            </div>

            <div className="mini-status">
              <CheckCircle2 size={18} />
              Complaint successfully analyzed
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <CheckCircle2 size={18} />
            <div>
              <strong>Issue Reported</strong>
              <span>Just now</span>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <Sparkles size={18} />
            <div>
              <strong>AI Priority: High</strong>
              <span>Analysis complete</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;