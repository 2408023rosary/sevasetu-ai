import { useState } from "react";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function LocationPicker({ onLocationChange }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const useCurrentLocation = () => {
    setError("");
    setLoading(true);

    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );

      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: "gps",
        };

        setLocation(locationData);
        setLoading(false);

        if (onLocationChange) {
          onLocationChange(locationData);
        }
      },
      () => {
        setLoading(false);

        setError(
          "Unable to access your location. Please allow location permission and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="location-picker">

      {!location ? (
        <div className="location-empty">

          <div className="location-icon">
            <MapPin size={25} />
          </div>

          <div className="location-content">

            <strong>
              Where did this issue happen?
            </strong>

            <p>
              Your location helps us send the complaint
              to the correct local authority.
            </p>

            <button
              type="button"
              className="location-button"
              onClick={useCurrentLocation}
              disabled={loading}
            >
              <Navigation size={16} />

              {loading
                ? "Getting your location..."
                : "Use my current location"}
            </button>

          </div>

        </div>
      ) : (
        <div className="location-success">

          <div className="location-success-icon">
            <CheckCircle2 size={22} />
          </div>

          <div className="location-success-content">

            <strong>
              Location captured
            </strong>

            <p>
              Your current location has been attached
              to this complaint.
            </p>

            <div className="coordinates">

              <span>
                Latitude:{" "}
                <strong>
                  {location.latitude.toFixed(6)}
                </strong>
              </span>

              <span>
                Longitude:{" "}
                <strong>
                  {location.longitude.toFixed(6)}
                </strong>
              </span>

            </div>

            <button
              type="button"
              className="change-location-button"
              onClick={useCurrentLocation}
            >
              <Navigation size={14} />
              Update location
            </button>

          </div>

        </div>
      )}

      {error && (
        <div className="location-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}

export default LocationPicker;