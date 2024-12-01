export interface DeploymentConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    offlineMode: boolean;
    realTimeUpdates: boolean;
    heatmapVisualization: boolean;
    batteryOptimization: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  storage: {
    maxSize: number;
    cleanupInterval: number;
  };
}

export const deploymentConfig: DeploymentConfig = {
  version: '1.0.0',
  environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
  features: {
    offlineMode: true,
    realTimeUpdates: true,
    heatmapVisualization: true,
    batteryOptimization: true
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    retryAttempts: 3
  },
  storage: {
    maxSize: 50 * 1024 * 1024, // 50MB
    cleanupInterval: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};