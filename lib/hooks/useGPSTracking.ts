'use client';

import { useState, useEffect } from 'react';
import { useOfflineDetection } from './useOfflineDetection';
import { GPSPoint, TrackingOptions } from '@/lib/types/gps';
import localforage from 'localforage';

export const useGPSTracking = (options: TrackingOptions = {}) => {
  const [currentPosition, setCurrentPosition] = useState<GPSPoint | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<GPSPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isOffline = useOfflineDetection();

  const {
    enableHighAccuracy = true,
    interval = 10000,
    minDistance = 10
  } = options;

  // Calculate distance between two points
  const calculateDistance = (p1: GPSPoint, p2: GPSPoint): number => {
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
  };

  // Save tracking history to local storage
  const saveTrackingHistory = async (points: GPSPoint[]) => {
    try {
      await localforage.setItem('gps-tracking-history', points);
    } catch (error) {
      console.error('Error saving tracking history:', error);
    }
  };

  // Load tracking history from local storage
  const loadTrackingHistory = async () => {
    try {
      const savedHistory = await localforage.getItem<GPSPoint[]>('gps-tracking-history');
      if (savedHistory) {
        setTrackingHistory(savedHistory);
      }
    } catch (error) {
      console.error('Error loading tracking history:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!navigator?.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    loadTrackingHistory();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint: GPSPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy
        };

        setCurrentPosition(newPoint);
        setError(null);

        // Only add to history if minimum distance is met
        setTrackingHistory(prevHistory => {
          const lastPoint = prevHistory[prevHistory.length - 1];
          if (!lastPoint || calculateDistance(lastPoint, newPoint) >= minDistance) {
            const newHistory = [...prevHistory, newPoint];
            if (isOffline) {
              saveTrackingHistory(newHistory);
            }
            return newHistory;
          }
          return prevHistory;
        });
      },
      (error) => {
        setError(error.message);
      },
      {
        enableHighAccuracy,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      if (navigator?.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, minDistance, isOffline]);

  return {
    currentPosition,
    trackingHistory,
    error,
    isOffline,
    calculateDistance
  };
};