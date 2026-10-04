export function isValidCoordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function hasValidComplaintLocation(complaint) {
  if (!complaint) {
    return false;
  }

  return isValidCoordinates(
    complaint.latitude,
    complaint.longitude
  );
}