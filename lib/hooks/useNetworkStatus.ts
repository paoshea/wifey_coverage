'use client';

import { useState, useEffect } from 'react';
import { NetworkStatus } from '@/lib/types/network';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = async () => {
      try {
        setLoading(true);
        
        // Get current position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator?.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Get network information
        const connection = (navigator as any).connection;
        const type = connection?.type === 'wifi' ? 'wifi' : 'cellular';
        
        // Calculate signal strength (normalized to percentage)
        const rssi = connection?.signalStrength || -85;
        const minRSSI = -100;
        const maxRSSI = -50;
        const strength = Math.min(100, Math.max(0, 
          ((rssi - minRSSI) / (maxRSSI - minRSSI)) * 100
        ));

        const newStatus: NetworkStatus = {
          type,
          strength,
          technology: type === 'cellular' ? '4G' : undefined,
          timestamp: Date.now(),
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };

        setStatus(newStatus);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get network status'));
      } finally {
        setLoading(false);
      }
    };

    updateStatus();
    const intervalId = setInterval(updateStatus, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return { status, loading, error };
};