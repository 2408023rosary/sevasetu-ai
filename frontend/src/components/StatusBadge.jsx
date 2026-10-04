function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "status-pending",
    },
    "in-progress": {
      label: "In Progress",
      className: "status-progress",
    },
    resolved: {
      label: "Resolved",
      className: "status-resolved",
    },
    rejected: {
      label: "Rejected",
      className: "status-rejected",
    },
  };

  const config =
    statusConfig[status] || statusConfig.pending;

  return (
    <span className={`status-badge ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}

export default StatusBadge;