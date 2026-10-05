import { ShieldCheck } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>SevaSetu</strong>
            <span>AI Civic Platform</span>
          </div>
        </div>

        <p>
          Empowering citizens to build better communities.
        </p>

        <span className="footer-copy">
          © 2026 SevaSetu AI
        </span>
      </div>
    </footer>
  );
}

export default Footer;