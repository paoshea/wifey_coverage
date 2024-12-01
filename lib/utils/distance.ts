import { NetworkStatus } from '@/lib/types/network';

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function findNearestCoveragePoints(
  currentLocation: { latitude: number; longitude: number },
  coveragePoints: { status: NetworkStatus }[],
  maxDistance: number = 10 // Default 10km radius
): { point: { status: NetworkStatus }; distance: number }[] {
  return coveragePoints
    .map(point => ({
      point,
      distance: calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        point.status.coordinates.latitude,
        point.status.coordinates.longitude
      )
    }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}