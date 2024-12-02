import { NetworkStatus } from '@/lib/types/network';

export class NetworkInfoService {
  private static async getNetworkType(): Promise<'cellular' | 'wifi'> {
    if (typeof window === 'undefined') return 'wifi';

    const connection = (navigator as any).connection;
    if (!connection) {
      // Fallback to checking online status
      return navigator?.onLine ? 'wifi' : 'cellular';
    }
    return connection.type === 'wifi' ? 'wifi' : 'cellular';
  }

  private static getNetworkTechnology(): '3G' | '4G' | '5G' {
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

  private static calculateSignalStrength(): number {
    if (typeof window === 'undefined') return 50;

    // Use Network Information API if available
    const connection = (navigator as any).connection;
    if (!connection) return -1;

    // Normalize RSSI values to percentage
    const rssi = connection.signalStrength || -85; // Default to -85 dBm
    const minRSSI = -100; // Typically -100 dBm is very weak
    const maxRSSI = -50;  // Typically -50 dBm is very strong

    return Math.min(100, Math.max(0, 
      ((rssi - minRSSI) / (maxRSSI - minRSSI)) * 100
    ));
  }

  static async getCurrentStatus(): Promise<NetworkStatus> {
    if (typeof window === 'undefined') {
      throw new Error('Not in browser environment');
    }

    if (!navigator?.geolocation) {
      throw new Error('Geolocation not supported');
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      type: await this.getNetworkType(),
      strength: this.calculateSignalStrength(),
      technology: this.getNetworkTechnology(),
      timestamp: Date.now(),
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    };
  }
}