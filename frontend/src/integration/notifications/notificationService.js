const NOTIFICATION_KEY = "sevasetu_notifications";

export function getNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to read notifications:", error);
    return [];
  }
}

export function addNotification(notification) {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now(),
    title: notification.title || "SevaSetu Update",
    message: notification.message || "",
    type: notification.type || "info",
    read: false,
    createdAt: new Date().toISOString(),
  };

  const updatedNotifications = [
    newNotification,
    ...notifications,
  ];

  localStorage.setItem(
    NOTIFICATION_KEY,
    JSON.stringify(updatedNotifications)
  );

  return newNotification;
}

export function markNotificationAsRead(id) {
  const notifications = getNotifications();

  const updatedNotifications = notifications.map(
    (notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
  );

  localStorage.setItem(
    NOTIFICATION_KEY,
    JSON.stringify(updatedNotifications)
  );

  return updatedNotifications;
}

export function clearNotifications() {
  localStorage.removeItem(NOTIFICATION_KEY);
}