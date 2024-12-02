import { CoveragePoint, NetworkStatus } from '@/lib/types/network';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { offlineSync } from './offline-sync';

class NetworkMonitor {
  private static instance: NetworkMonitor;
  private monitoringInterval: NodeJS.Timer | null = null;
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
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.getCurrentNetworkStatus();
      });
    }
  }

  private getConnectionType(): 'cellular' | 'wifi' {
    if (typeof window === 'undefined') return 'wifi';
    
    const connection = (navigator as any).connection;
    return connection?.type === 'wifi' ? 'wifi' : 'cellular';
  }

  private getSignalStrength(): number {
    if (typeof window === 'undefined') return 50;

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
    if (typeof window === 'undefined') return '4G';

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
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Not in browser environment'));
    }

    if (!navigator?.geolocation) {
      return Promise.reject(new Error('Geolocation not supported'));
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }

  private async getCurrentNetworkStatus(): Promise<NetworkStatus> {
    if (typeof window === 'undefined') {
      throw new Error('Not in browser environment');
    }

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

  startMonitoring(): void {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(async () => {
      try {
        if (typeof window === 'undefined') return;

        const status = await this.getCurrentNetworkStatus();
        const point = {
          id: crypto.randomUUID(),
          status,
          reportedBy: 'current-user',
          verified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (navigator?.onLine) {
          useCoverageStore.getState().addCoveragePoint(point);
        } else {
          await offlineSync.addToQueue(point);
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
}

export const networkMonitor = NetworkMonitor.getInstance();