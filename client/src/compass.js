import { getGreatCircleBearing } from "geolib";

export const findQiblaAngle = (userLat, userLon) => {
  const makkah = { latitude: 21.4224, longitude: 39.8262 };
  const user = { latitude: userLat, longitude: userLon };

  // returns the bearing in degrees (0-360)
  return getGreatCircleBearing(user, makkah);
};

/**
 * Fixes the sensor data for different devices.
 */
export const getCleanHeading = (event) => {
  // Use absolute alpha for Android if webkitCompassHeading isn't available
  let angle = event.webkitCompassHeading || event.alpha;

  if (!angle) return null;

  // Normalize to 0-360 range
  return Math.round(angle);
};
