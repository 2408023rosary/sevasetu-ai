import { useState } from "react";
import { getCurrentLocation } from "../services/locationService";

export default function LocationPicker({ onLocationSelect }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      setError("");

      const currentLocation = await getCurrentLocation();

      setLocation(currentLocation);

      if (onLocationSelect) {
        onLocationSelect(currentLocation);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-picker">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={loading}
      >
        {loading ? "Getting Location..." : "📍 Get My Location"}
      </button>

      {location && (
        <div>
          <p>
            <strong>Location selected</strong>
          </p>

          <p>
            Latitude: {location.latitude.toFixed(6)}
          </p>

          <p>
            Longitude: {location.longitude.toFixed(6)}
          </p>

          <p>
            Accuracy: approximately{" "}
            {Math.round(location.accuracy)} meters
          </p>
        </div>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}
    </div>
  );
}