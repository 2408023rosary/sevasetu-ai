import {
  ArrowRight,
  Lightbulb,
  MapPin,
  Trash2,
  Construction,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import ComplaintCard from "../components/ComplaintCard";

const demoComplaints = [
  {
    id: "CIV-1042",
    title: "Road damage near main junction",
    status: "in-progress",
    location: "Main Road, Ward 4",
    icon: <Construction size={20} />,
  },
  {
    id: "CIV-1038",
    title: "Street light not working",
    status: "pending",
    location: "Station Road, Ward 2",
    icon: <Lightbulb size={20} />,
  },
  {
    id: "CIV-1029",
    title: "Garbage accumulation",
    status: "resolved",
    location: "Market Area, Ward 6",
    icon: <Trash2 size={20} />,
  },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      <DashboardHeader />

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              Citizen Dashboard
            </span>

            <h1>
              Welcome back, <span>Citizen.</span>
            </h1>

            <p>
              Keep track of your civic reports and help make
              your community better.
            </p>
          </div>

          <Link
            to="/create-complaint"
            className="dashboard-primary-button"
          >
            <MapPin size={18} />
            Report an Issue
          </Link>
        </section>

        <section className="stats-grid">
          <StatCard
            type="total"
            label="Total Complaints"
            value="12"
          />

          <StatCard
            type="pending"
            label="Pending"
            value="4"
          />

          <StatCard
            type="progress"
            label="In Progress"
            value="3"
          />

          <StatCard
            type="resolved"
            label="Resolved"
            value="5"
          />
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">
                Activity
              </span>

              <h2>Recent Complaints</h2>
            </div>

            <Link to="/my-complaints">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="complaints-list">
            {demoComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-tip">
          <div className="tip-icon">✨</div>

          <div>
            <strong>Make your report more effective</strong>

            <p>
              Add a clear photo and accurate location.
              SevaSetu AI can use this information to
              classify and prioritize your complaint.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;