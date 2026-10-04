import { ArrowRight, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";

function ComplaintCard({ complaint }) {
  return (
    <article className="complaint-card">
      <div className="complaint-card-main">
        <div className="complaint-category-icon">
          {complaint.icon}
        </div>

        <div className="complaint-card-info">
          <div className="complaint-title-row">
            <h3>{complaint.title}</h3>

            <StatusBadge status={complaint.status} />
          </div>

          <span className="complaint-id">
            {complaint.id}
          </span>

          <div className="complaint-location">
            <MapPin size={14} />
            {complaint.location}
          </div>
        </div>
      </div>

      <a
        href={`/complaints/${complaint.id}`}
        className="complaint-view"
      >
        <span>View</span>
        <ArrowRight size={17} />
      </a>
    </article>
  );
}

export default ComplaintCard;