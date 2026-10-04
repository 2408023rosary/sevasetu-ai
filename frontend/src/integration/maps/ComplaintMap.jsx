import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./maps.css";
import { getCurrentLocation } from "../services/locationService";

// Fix default Leaflet marker icons when using Vite.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_LOCATION = [20.5937, 78.9629]; // India

function MapCenter({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 15);
    }
  }, [location, map]);

  return null;
}

export default function ComplaintMap({
  complaints = [],
  height = "500px",
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const handleGetLocation = async () => {
    try {
      setLocationError("");

      const location = await getCurrentLocation();

      setUserLocation(location);
    } catch (error) {
      setLocationError(error.message);
    }
  };

  return (
    <div className="complaint-map-wrapper">
      <div className="map-controls">
        <button
          type="button"
          onClick={handleGetLocation}
          className="location-button"
        >
          📍 Use My Location
        </button>

        {locationError && (
          <p className="location-error">
            {locationError}
          </p>
        )}

        {userLocation && (
          <p className="location-info">
            Location detected:
            <br />
            Latitude: {userLocation.latitude.toFixed(6)}
            <br />
            Longitude: {userLocation.longitude.toFixed(6)}
            <br />
            Accuracy: approximately{" "}
            {Math.round(userLocation.accuracy)} meters
          </p>
        )}
      </div>

      <MapContainer
        center={
          userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : DEFAULT_LOCATION
        }
        zoom={userLocation ? 15 : 5}
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter location={userLocation} />

        {/* User's location */}
        {userLocation && (
          <Marker
            position={[
              userLocation.latitude,
              userLocation.longitude,
            ]}
          >
            <Popup>
              <strong>Your Location</strong>
              <br />
              Latitude: {userLocation.latitude.toFixed(6)}
              <br />
              Longitude: {userLocation.longitude.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {/* Complaint markers */}
        {complaints.map((complaint) => {
          if (
            typeof complaint.latitude !== "number" ||
            typeof complaint.longitude !== "number"
          ) {
            return null;
          }

          return (
            <Marker
              key={complaint.id}
              position={[
                complaint.latitude,
                complaint.longitude,
              ]}
            >
              <Popup>
                <strong>
                  {complaint.title || "Complaint"}
                </strong>

                {complaint.category && (
                  <>
                    <br />
                    Category: {complaint.category}
                  </>
                )}

                {complaint.status && (
                  <>
                    <br />
                    Status: {complaint.status}
                  </>
                )}

                {complaint.description && (
                  <>
                    <br />
                    {complaint.description}
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}