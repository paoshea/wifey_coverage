'use client';

import { useState, useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

interface BatteryConfig {
  highAccuracy: boolean;
  interval: number;
  significantChange: {
    distance: number; // meters
    strength: number; // percentage points
  };
}

export const useBatteryEfficientTracking = (config: BatteryConfig) => {
  const [isTracking, setIsTracking] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const { status } = useNetworkStatus();
  const [lastRecorded, setLastRecorded] = useState<{
    position?: GeolocationPosition;
    strength?: number;
  }>({});

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(battery.level * 100);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      } catch (error) {
        console.error('Battery API not supported:', error);
      }
    };

    getBatteryInfo();
  }, []);

  const shouldUpdate = (
    newPosition: GeolocationPosition,
    newStrength: number
  ): boolean => {
    if (!lastRecorded.position || !lastRecorded.strength) return true;

    const distance = calculateDistance(
      lastRecorded.position.coords.latitude,
      lastRecorded.position.coords.longitude,
      newPosition.coords.latitude,
      newPosition.coords.longitude
    );

    const strengthDiff = Math.abs(newStrength - lastRecorded.strength);

    return (
      distance >= config.significantChange.distance ||
      strengthDiff >= config.significantChange.strength
    );
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return {
    isTracking,
    batteryLevel,
    startTracking,
    stopTracking
  };
};