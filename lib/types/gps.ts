export interface GPSPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface TrackingOptions {
  enableHighAccuracy?: boolean;  // Use high accuracy mode (uses more battery)
  maximumAge?: number;  // Maximum age in milliseconds of a cached position
  timeout?: number;  // Timeout in milliseconds for position request
  minDistance?: number;  // Minimum distance in meters between updates
  minTimeInterval?: number;  // Minimum time in milliseconds between updates
  persistLocally?: boolean;  // Whether to store points locally when offline
  maxStorageSize?: number;  // Maximum number of points to store locally
  storageKey?: string;  // Key to use for local storage
  batchSize?: number;  // Number of points to sync at once when back online
}

export interface TrackingState {
  isTracking: boolean;
  lastPosition: GPSPoint | null;
  error: GeolocationPositionError | null;
  accuracy: 'high' | 'low' | 'none';
  storedPoints: number;  // Number of points stored locally
  isSyncing: boolean;  // Whether points are being synced to server
}

export interface GPSError extends Error {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}
