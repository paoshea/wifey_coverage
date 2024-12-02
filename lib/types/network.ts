export interface NetworkStatus {
  type: 'cellular' | 'wifi';
  strength: number;
  speed?: number;
  latency?: number;
  provider?: string;
  technology?: '3G' | '4G' | '5G';
  timestamp: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface CoveragePoint {
  id: string;
  status: NetworkStatus;
  reportedBy: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpeedTestResult {
  id: string;
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
  networkStatus: NetworkStatus;
}