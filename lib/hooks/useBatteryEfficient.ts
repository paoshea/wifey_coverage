'use client';

import { useState, useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { BatteryConfig, BatteryStatus } from '@/lib/types/battery';

export const useBatteryEfficientTracking = (config: BatteryConfig) => {
  const [isTracking, setIsTracking] = useState(false);
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);
  const { status } = useNetworkStatus();
  const [lastRecorded, setLastRecorded] = useState<{
    position?: GeolocationPosition;
    timestamp: number;
  }>({ timestamp: Date.now() });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getBatteryInfo = async () => {
      try {
        if (!navigator || !(navigator as any).getBattery) {
          console.warn('Battery API not supported');
          return;
        }

        const battery = await (navigator as any).getBattery();
        updateBatteryStatus(battery);

        // Add event listeners for battery status changes
        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingtimechange', () => updateBatteryStatus(battery));
        battery.addEventListener('dischargingtimechange', () => updateBatteryStatus(battery));
      } catch (error) {
        console.error('Battery API error:', error);
      }
    };

    getBatteryInfo();
  }, []);

  const updateBatteryStatus = (battery: any) => {
    setBatteryStatus({
      charging: battery.charging,
      level: battery.level * 100,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    });
  };

  useEffect(() => {
    if (!isTracking || !batteryStatus) return;

    // Stop tracking if battery is too low
    if (batteryStatus.level < config.minBatteryLevel && config.stopTrackingOnLowBattery) {
      setIsTracking(false);
      return;
    }

    // Determine tracking interval based on battery status
    const interval = batteryStatus.level <= config.lowBatteryThreshold && config.reducedFrequencyOnLowBattery
      ? config.lowBatteryUpdateInterval || 60000 // Default to 1 minute on low battery
      : 10000; // Default to 10 seconds on normal battery

    const trackingTimer = setInterval(() => {
      if (!navigator?.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const now = Date.now();
          // Only update if enough time has passed
          if (now - lastRecorded.timestamp >= interval) {
            setLastRecorded({
              position,
              timestamp: now
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: batteryStatus.level > config.lowBatteryThreshold,
          timeout: 10000,
          maximumAge: interval
        }
      );
    }, interval);

    return () => clearInterval(trackingTimer);
  }, [isTracking, batteryStatus, config, lastRecorded]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return {
    isTracking,
    batteryStatus,
    startTracking,
    stopTracking
  };
};