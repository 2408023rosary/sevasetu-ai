import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "./notificationService";
import "./notifications.css";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleClear = () => {
    clearNotifications();
    setNotifications([]);
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h3>Notifications</h3>

        {notifications.length > 0 && (
          <button type="button" onClick={handleClear}>
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.read ? "read" : "unread"
            }`}
          >
            <strong>{notification.title}</strong>

            <p>{notification.message}</p>

            {!notification.read && (
              <button
                type="button"
                onClick={() =>
                  handleMarkAsRead(notification.id)
                }
              >
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}