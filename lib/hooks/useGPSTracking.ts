'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOfflineDetection } from './useOfflineDetection';
import { GPSPoint, TrackingOptions, TrackingState } from '@/lib/types/gps';
import localforage from 'localforage';

const DEFAULT_OPTIONS: TrackingOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
  minDistance: 10,
  minTimeInterval: 10000,
  persistLocally: true,
  maxStorageSize: 1000,
  storageKey: 'gps-tracking-history',
  batchSize: 50
};

export const useGPSTracking = (options: TrackingOptions = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    lastPosition: null,
    error: null,
    accuracy: 'none',
    storedPoints: 0,
    isSyncing: false
  });
  const [trackingHistory, setTrackingHistory] = useState<GPSPoint[]>([]);
  const isOffline = useOfflineDetection();

  // Calculate distance between two points
  const calculateDistance = useCallback((p1: GPSPoint, p2: GPSPoint): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (p1.latitude * Math.PI) / 180;
    const φ2 = (p2.latitude * Math.PI) / 180;
    const Δφ = ((p2.latitude - p1.latitude) * Math.PI) / 180;
    const Δλ = ((p2.longitude - p1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []); // No dependencies needed as it's a pure calculation

  const loadTrackingHistory = useCallback(async () => {
    if (!opts.persistLocally) return;
    try {
      const stored = await localforage.getItem<GPSPoint[]>('tracking-history');
      if (stored) {
        setTrackingHistory(stored);
      }
    } catch (error) {
      console.error('Failed to load tracking history:', error);
    }
  }, [opts.persistLocally]);

  const saveTrackingHistory = useCallback(async (history: GPSPoint[]) => {
    if (!opts.persistLocally) return;
    try {
      await localforage.setItem('tracking-history', history);
    } catch (error) {
      console.error('Failed to save tracking history:', error);
    }
  }, [opts.persistLocally]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!navigator?.geolocation) {
      const error = {
        code: 2, // POSITION_UNAVAILABLE
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      } as GeolocationPositionError;

      setState(prev => ({
        ...prev,
        error,
        accuracy: 'none'
      }));
      return;
    }

    loadTrackingHistory();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint: GPSPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };

        setState(prev => ({
          ...prev,
          lastPosition: newPoint,
          error: null,
          accuracy: opts.enableHighAccuracy ? 'high' : 'low'
        }));

        setTrackingHistory(prevHistory => {
          const lastPoint = prevHistory[prevHistory.length - 1];
          if (!lastPoint || 
              (calculateDistance(lastPoint, newPoint) >= opts.minDistance! &&
               newPoint.timestamp - lastPoint.timestamp >= opts.minTimeInterval!)) {
            const newHistory = [...prevHistory, newPoint];
            if (isOffline && opts.persistLocally) {
              saveTrackingHistory(newHistory);
            }
            return newHistory;
          }
          return prevHistory;
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error,
          accuracy: 'none'
        }));
      },
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        timeout: opts.timeout,
        maximumAge: opts.maximumAge
      }
    );

    return () => {
      if (navigator?.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [
    opts.enableHighAccuracy,
    opts.minDistance,
    opts.minTimeInterval,
    opts.maximumAge,
    opts.timeout,
    opts.persistLocally,
    isOffline,
    calculateDistance,
    saveTrackingHistory
  ]);

  const startTracking = () => {
    setState(prev => ({ ...prev, isTracking: true }));
  };

  const stopTracking = () => {
    setState(prev => ({ ...prev, isTracking: false }));
  };

  return {
    ...state,
    trackingHistory,
    startTracking,
    stopTracking,
    calculateDistance
  };
};