import { NetworkStatus } from '@/lib/types/network';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { offlineSync } from './offline-sync';

class NetworkMonitor {
  private static instance: NetworkMonitor;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly UPDATE_INTERVAL = 10000; // 10 seconds

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupNetworkListeners();
    }
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private async handleOnline(): Promise<void> {
    console.log('Network connection restored');
    await offlineSync.syncData();
  }

  private handleOffline(): void {
    console.log('Network connection lost');
  }

  startMonitoring(): void {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(async () => {
      try {
        const status = await this.getCurrentNetworkStatus();
        const point = {
          id: crypto.randomUUID(),
          status,
          reportedBy: 'current-user',
          verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (navigator.onLine) {
          useCoverageStore.getState().addCoveragePoint(point);
        } else {
          await offlineSync.addOfflinePoint(point);
        }
      } catch (error) {
        console.error('Error monitoring network status:', error);
      }
    }, this.UPDATE_INTERVAL);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async getCurrentNetworkStatus(): Promise<NetworkStatus> {
    const position = await this.getCurrentPosition();
    const connection = (navigator as any).connection;
    
    return {
      type: this.getConnectionType(),
      strength: this.getSignalStrength(),
      technology: this.getNetworkTechnology(),
      provider: connection?.effectiveType || 'unknown',
      timestamp: Date.now(),
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    };
  }

  private getConnectionType(): 'cellular' | 'wifi' {
    const connection = (navigator as any).connection;
    return connection?.type === 'wifi' ? 'wifi' : 'cellular';
  }

  private getSignalStrength(): number {
    const connection = (navigator as any).connection;
    if (!connection) return 50; // Default value

    // Normalize RSSI values to percentage
    const rssi = connection.signalStrength || -85;
    const minRSSI = -100;
    const maxRSSI = -50;

    return Math.min(100, Math.max(0, 
      ((rssi - minRSSI) / (maxRSSI - minRSSI)) * 100
    ));
  }

  private getNetworkTechnology(): '3G' | '4G' | '5G' {
    const connection = (navigator as any).connection;
    if (!connection?.effectiveType) return '4G';

    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
      case '3g':
        return '3G';
      case '4g':
        return '4G';
      default:
        return '5G';
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }
}

export const networkMonitor = NetworkMonitor.getInstance();