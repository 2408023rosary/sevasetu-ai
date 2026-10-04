import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const complaints = [
  {
    id: "SVS-2026-4827",
    category: "Roads & Potholes",
    description:
      "Large pothole near the main entrance of the college.",
    status: "Under Review",
    statusType: "review",
    priority: "Urgent",
    date: "Today",
  },
  {
    id: "SVS-2026-3714",
    category: "Street Lights",
    description:
      "Street light not working near the library entrance.",
    status: "In Progress",
    statusType: "progress",
    priority: "High",
    date: "2 days ago",
  },
  {
    id: "SVS-2026-2189",
    category: "Garbage & Waste",
    description:
      "Garbage accumulation near the residential area.",
    status: "Resolved",
    statusType: "resolved",
    priority: "Medium",
    date: "1 week ago",
  },
];

function MyComplaints() {
  return (
    <div className="complaints-page">

      {/* HEADER */}

      <header className="complaint-header">

        <Link
          to="/dashboard"
          className="complaint-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="complaint-brand">
          <strong>SevaSetu</strong>
          <span>My complaints</span>
        </div>

      </header>


      {/* MAIN */}

      <main className="complaints-main">

        {/* HEADING */}

        <section className="complaints-heading">

          <div>

            <span className="dashboard-eyebrow">
              Complaint History
            </span>

            <h1>
              My Complaints
            </h1>

            <p>
              Track the issues you've reported and
              monitor their progress.
            </p>

          </div>

          <Link
            to="/create-complaint"
            className="primary-button"
          >
            <Plus size={17} />
            Report New Issue
          </Link>

        </section>


        {/* SUMMARY */}

        <section className="complaint-summary">

          <div className="summary-card">

            <div className="summary-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Total Complaints</span>
              <strong>{complaints.length}</strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              <AlertCircle size={20} />
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {
                  complaints.filter(
                    (complaint) =>
                      complaint.statusType !== "resolved"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Resolved</span>
              <strong>
                {
                  complaints.filter(
                    (complaint) =>
                      complaint.statusType === "resolved"
                  ).length
                }
              </strong>
            </div>

          </div>

        </section>


        {/* COMPLAINT LIST */}

        <section className="complaints-list">

          <div className="list-header">

            <div>
              <h2>
                Recent complaints
              </h2>

              <p>
                Your latest reported civic issues.
              </p>
            </div>

          </div>


          {complaints.length === 0 ? (

            /* EMPTY STATE */

            <div className="complaints-empty">

              <div className="empty-icon">
                <AlertCircle size={28} />
              </div>

              <h2>
                No complaints yet
              </h2>

              <p>
                You haven't reported any civic issues.
                Start by reporting an issue in your area.
              </p>

              <Link
                to="/create-complaint"
                className="primary-button"
              >
                Report an Issue
                <ArrowRight size={17} />
              </Link>

            </div>

          ) : (

            /* COMPLAINT CARDS */

            <div className="complaints-grid">

              {complaints.map((complaint) => (

                <article
                  className="complaint-card"
                  key={complaint.id}
                >

                  <div className="complaint-card-top">

                    <div>

                      <span className="complaint-id">
                        {complaint.id}
                      </span>

                      <h3>
                        {complaint.category}
                      </h3>

                    </div>

                    <span
                      className={`status-badge ${complaint.statusType}`}
                    >
                      {complaint.status}
                    </span>

                  </div>


                  <p className="complaint-description">
                    {complaint.description}
                  </p>


                  <div className="complaint-card-meta">

                    <span>
                      Reported {complaint.date}
                    </span>

                    <span
                      className={`priority-badge ${complaint.priority.toLowerCase()}`}
                    >
                      {complaint.priority}
                    </span>

                  </div>


                  <div className="complaint-card-footer">

                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="view-complaint"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MyComplaints;