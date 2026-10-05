import { ShieldCheck } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>SevaSetu</strong>
            <span>AI Civic Platform</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;