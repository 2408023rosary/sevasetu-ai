import {
  Bell,
  LogOut,
  Plus,
  UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <Link to="/dashboard" className="dashboard-brand">
          <div className="brand-icon">
            <span>SS</span>
          </div>

          <div>
            <strong>SevaSetu</strong>
            <span>Citizen Portal</span>
          </div>
        </Link>

        <div className="dashboard-actions">
          <button className="notification-button">
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          <div className="dashboard-user">
            <UserCircle size={28} />

            <div>
              <strong>{user?.name || "Citizen"}</strong>
              <span>Citizen</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>

          <Link
            to="/create-complaint"
            className="dashboard-report-button"
          >
            <Plus size={18} />
            Report Issue
          </Link>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;