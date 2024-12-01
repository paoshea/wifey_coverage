'use client';

import { NetworkStatus } from '@/lib/types/network';

export interface Geofence {
  id: string;
  name: string;
  radius: number; // in meters
  center: {
    latitude: number;
    longitude: number;
  };
  triggers: {
    onEnter?: boolean;
    onExit?: boolean;
    onDwell?: boolean;
    dwellTime?: number; // in milliseconds
  };
}

class GeofencingService {
  private geofences: Map<string, Geofence> = new Map();
  private callbacks: Map<string, ((event: GeofenceEvent) => void)[]> = new Map();

  addGeofence(geofence: Geofence): void {
    this.geofences.set(geofence.id, geofence);
  }

  removeGeofence(id: string): void {
    this.geofences.delete(id);
    this.callbacks.delete(id);
  }

  subscribe(
    geofenceId: string,
    callback: (event: GeofenceEvent) => void
  ): () => void {
    const callbacks = this.callbacks.get(geofenceId) || [];
    callbacks.push(callback);
    this.callbacks.set(geofenceId, callbacks);

    return () => {
      const updatedCallbacks = this.callbacks.get(geofenceId) || [];
      this.callbacks.set(
        geofenceId,
        updatedCallbacks.filter(cb => cb !== callback)
      );
    };
  }

  checkGeofences(status: NetworkStatus): void {
    this.geofences.forEach(geofence => {
      const distance = this.calculateDistance(
        status.coordinates.latitude,
        status.coordinates.longitude,
        geofence.center.latitude,
        geofence.center.longitude
      );

      const isInside = distance <= geofence.radius;
      const callbacks = this.callbacks.get(geofence.id) || [];

      callbacks.forEach(callback => {
        callback({
          geofenceId: geofence.id,
          isInside,
          distance,
          timestamp: Date.now(),
          location: status.coordinates
        });
      });
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
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
  }
}

export interface GeofenceEvent {
  geofenceId: string;
  isInside: boolean;
  distance: number;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const geofencingService = new GeofencingService();