import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

const icons = {
  total: FileText,
  pending: Clock3,
  progress: AlertCircle,
  resolved: CheckCircle2,
};

function StatCard({ type, label, value }) {
  const Icon = icons[type] || FileText;

  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${type}`}>
        <Icon size={21} />
      </div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default StatCard;