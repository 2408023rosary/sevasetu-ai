import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock3,
  UserRound,
  Brain,
  Image as ImageIcon,
} from "lucide-react";

const complaintData = {
  id: "SVS-2026-4827",
  category: "Roads & Potholes",
  description:
    "There is a large pothole near the main entrance of the college. It is difficult for vehicles to pass safely.",
  status: "Under Review",
  priority: "Urgent",
  severity: "High",
  confidence: 94,
  duplicate: true,
  department: "Roads & Infrastructure Department",
  reportedDate: "October 4, 2026",
  location: {
    latitude: 15.2993,
    longitude: 74.124,
  },
};

function ComplaintDetails() {
  const { id } = useParams();

  // Temporary mock data.
  // Later this will come from Member 1's backend.
  const complaint = {
    ...complaintData,
    id: id || complaintData.id,
  };

  return (
    <div className="details-page">

      {/* HEADER */}

      <header className="complaint-header">

        <Link
          to="/my-complaints"
          className="complaint-back"
        >
          <ArrowLeft size={18} />
          Back to My Complaints
        </Link>

        <div className="complaint-brand">
          <strong>SevaSetu</strong>
          <span>Complaint details</span>
        </div>

      </header>


      {/* MAIN */}

      <main className="details-main">

        {/* TOP */}

        <section className="details-heading">

          <div>

            <span className="dashboard-eyebrow">
              Complaint Details
            </span>

            <h1>{complaint.category}</h1>

            <p className="details-id">
              Complaint ID:{" "}
              <strong>{complaint.id}</strong>
            </p>

          </div>

          <span className="status-badge review">
            {complaint.status}
          </span>

        </section>


        {/* STATUS TIMELINE */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-card-icon">
              <Clock3 size={19} />
            </div>

            <div>
              <h2>Complaint Progress</h2>
              <p>
                Track the progress of your complaint.
              </p>
            </div>

          </div>


          <div className="complaint-timeline">

            <div className="timeline-item completed">

              <div className="timeline-marker">
                <CheckCircle2 size={17} />
              </div>

              <div className="timeline-content">
                <strong>Complaint Submitted</strong>
                <span>
                  Your complaint was successfully recorded.
                </span>
                <small>
                  {complaint.reportedDate}
                </small>
              </div>

            </div>


            <div className="timeline-item active">

              <div className="timeline-marker">
                <Clock3 size={17} />
              </div>

              <div className="timeline-content">
                <strong>Under Review</strong>
                <span>
                  The concerned department is reviewing
                  your complaint.
                </span>
                <small>
                  Current status
                </small>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-marker">
                <UserRound size={17} />
              </div>

              <div className="timeline-content">
                <strong>Assigned</strong>
                <span>
                  An officer will be assigned to this issue.
                </span>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-marker">
                <Clock3 size={17} />
              </div>

              <div className="timeline-content">
                <strong>In Progress</strong>
                <span>
                  The department will begin working on
                  the reported issue.
                </span>
              </div>

            </div>


            <div className="timeline-item">

              <div className="timeline-marker">
                <CheckCircle2 size={17} />
              </div>

              <div className="timeline-content">
                <strong>Resolved</strong>
                <span>
                  The complaint will be marked resolved
                  once the issue has been addressed.
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* TWO COLUMN AREA */}

        <div className="details-grid">

          {/* DESCRIPTION */}

          <section className="details-card">

            <div className="details-card-header">

              <div className="details-card-icon">
                <ImageIcon size={19} />
              </div>

              <div>
                <h2>Reported Issue</h2>
                <p>
                  Information provided with your complaint.
                </p>
              </div>

            </div>


            <div className="detail-section">

              <span>Category</span>

              <strong>
                {complaint.category}
              </strong>

            </div>


            <div className="detail-section">

              <span>Description</span>

              <p>
                {complaint.description}
              </p>

            </div>


            <div className="detail-section">

              <span>Reported Date</span>

              <strong>
                {complaint.reportedDate}
              </strong>

            </div>

          </section>


          {/* AI ANALYSIS */}

          <section className="details-card">

            <div className="details-card-header">

              <div className="details-card-icon">
                <Brain size={19} />
              </div>

              <div>
                <h2>AI Analysis</h2>
                <p>
                  Automated assessment of your complaint.
                </p>
              </div>

            </div>


            <div className="ai-details-grid">

              <div>
                <span>Severity</span>
                <strong className="ai-high">
                  {complaint.severity}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong className="ai-urgent">
                  {complaint.priority}
                </strong>
              </div>

              <div>
                <span>Confidence</span>
                <strong>
                  {complaint.confidence}%
                </strong>
              </div>

              <div>
                <span>Duplicate Check</span>
                <strong>
                  {complaint.duplicate
                    ? "Possible Match"
                    : "No Match"}
                </strong>
              </div>

            </div>

          </section>

        </div>


        {/* LOCATION */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-card-icon">
              <MapPin size={19} />
            </div>

            <div>
              <h2>Complaint Location</h2>
              <p>
                Location captured when the complaint
                was submitted.
              </p>
            </div>

          </div>


          <div className="location-details">

            <div>
              <span>Latitude</span>
              <strong>
                {complaint.location.latitude.toFixed(6)}
              </strong>
            </div>

            <div>
              <span>Longitude</span>
              <strong>
                {complaint.location.longitude.toFixed(6)}
              </strong>
            </div>

            <div>
              <span>Assigned Department</span>
              <strong>
                {complaint.department}
              </strong>
            </div>

          </div>


          <div className="map-placeholder">

            <MapPin size={30} />

            <strong>
              Map integration coming next
            </strong>

            <span>
              The complaint location will be displayed
              on the interactive map.
            </span>

          </div>

        </section>


        {/* FOOTER */}

        <div className="details-footer">

          <Link
            to="/my-complaints"
            className="secondary-button"
          >
            <ArrowLeft size={17} />
            Back to Complaints
          </Link>

          <Link
            to="/create-complaint"
            className="primary-button"
          >
            Report Another Issue
          </Link>

        </div>

      </main>

    </div>
  );
}

export default ComplaintDetails;