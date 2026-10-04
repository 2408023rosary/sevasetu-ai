export function normalizeComplaint(complaint) {
  return {
    id: complaint.id,
    title: complaint.title || "Complaint",
    category: complaint.category || "General",
    status: complaint.status || "Pending",
    description: complaint.description || "",
    latitude: Number(complaint.latitude),
    longitude: Number(complaint.longitude),
  };
}

export function getValidComplaints(complaints = []) {
  return complaints
    .map(normalizeComplaint)
    .filter(
      (complaint) =>
        Number.isFinite(complaint.latitude) &&
        Number.isFinite(complaint.longitude)
    );
}