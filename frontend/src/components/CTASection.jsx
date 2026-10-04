import { ArrowRight, Sparkles } from "lucide-react";

function CTASection() {
  return (
    <section className="cta-section" id="impact">
      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-icon">
            <Sparkles size={24} />
          </div>

          <span className="section-eyebrow">Your community needs you</span>

          <h2>
            See something that needs fixing?
          </h2>

          <p>
            Report it. Track it. Help make your community better.
          </p>

          <a href="/register" className="cta-button">
            Start a Report
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;