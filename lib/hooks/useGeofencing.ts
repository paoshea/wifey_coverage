'use client';

import { useState, useEffect } from 'react';
import { geofencingService, Geofence, GeofenceEvent } from '@/lib/services/geofencing';
import { useNetworkStatus } from './useNetworkStatus';

export const useGeofencing = (geofences: Geofence[]) => {
  const [events, setEvents] = useState<GeofenceEvent[]>([]);
  const { status } = useNetworkStatus();

  useEffect(() => {
    // Set up geofences
    geofences.forEach(geofence => {
      geofencingService.addGeofence(geofence);
    });

    // Subscribe to geofence events
    const unsubscribes = geofences.map(geofence =>
      geofencingService.subscribe(geofence.id, (event) => {
        setEvents(prev => [...prev, event]);
      })
    );

    return () => {
      // Cleanup subscriptions and geofences
      unsubscribes.forEach(unsubscribe => unsubscribe());
      geofences.forEach(geofence => {
        geofencingService.removeGeofence(geofence.id);
      });
    };
  }, [geofences]);

  useEffect(() => {
    if (status) {
      geofencingService.checkGeofences(status);
    }
  }, [status]);

  return {
    events,
    clearEvents: () => setEvents([])
  };
};