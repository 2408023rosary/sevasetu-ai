import { addNotification } from "./notificationService";

export function notifyComplaintSubmitted(complaint) {
  addNotification({
    title: "Complaint Submitted",
    message: `Your complaint ${
      complaint.title || ""
    } has been submitted successfully.`,
    type: "success",
  });
}

export function notifyComplaintStatusChanged(
  complaint,
  newStatus
) {
  addNotification({
    title: "Complaint Status Updated",
    message: `Your complaint ${
      complaint.title || ""
    } is now marked as ${newStatus}.`,
    type: "info",
  });
}