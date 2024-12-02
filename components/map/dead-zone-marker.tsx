'use client';

import { useEffect, useState } from 'react';
import { Circle, Popup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { NetworkStatus } from '@/lib/types/network';

interface DeadZone {
  id: string;
  center: [number, number];
  radius: number;
  reportCount: number;
  lastReported: string;
}

export function DeadZoneMarker() {
  const map = useMap();
  const { coveragePoints } = useCoverageStore();
  const [deadZones, setDeadZones] = useState<DeadZone[]>([]);

  useEffect(() => {
    if (!coveragePoints.length) return;

    const weakPoints = coveragePoints.filter(
      point => point.status.strength < 20
    );

    identifyDeadZones(weakPoints.map(p => p.status));
  }, [coveragePoints, identifyDeadZones]);

  const identifyDeadZones = (points: NetworkStatus[]): void => {
    const zones: DeadZone[] = [];
    const processed = new Set<number>();

    points.forEach((point, index) => {
      if (processed.has(index)) return;

      const cluster = points.filter((p, i) => {
        if (processed.has(i)) return false;
        
        const distance = calculateDistance(
          point.coordinates.latitude,
          point.coordinates.longitude,
          p.coordinates.latitude,
          p.coordinates.longitude
        );

        return distance <= 100; // 100 meters radius
      });

      if (cluster.length >= 3) { // Minimum 3 reports to consider a dead zone
        const center = calculateCenter(cluster);
        const radius = calculateRadius(cluster, center);
        
        zones.push({
          id: `dead-zone-${zones.length}`,
          center: [center.latitude, center.longitude],
          radius,
          reportCount: cluster.length,
          lastReported: new Date().toISOString()
        });

        cluster.forEach((_, i) => processed.add(i));
      }
    });

    setDeadZones(zones);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  const calculateCenter = (points: NetworkStatus[]) => {
    const lat = points.reduce((sum, p) => sum + p.coordinates.latitude, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.coordinates.longitude, 0) / points.length;
    return { latitude: lat, longitude: lng };
  };

  const calculateRadius = (points: NetworkStatus[], center: { latitude: number; longitude: number }) => {
    return Math.max(
      ...points.map(p =>
        calculateDistance(
          center.latitude,
          center.longitude,
          p.coordinates.latitude,
          p.coordinates.longitude
        )
      )
    );
  };

  return (
    <>
      {deadZones.map(zone => (
        <Circle
          key={zone.id}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.3
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold mb-2">Dead Zone</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {zone.reportCount} reports in this area
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  map.setView(zone.center, 16);
                }}
              >
                Zoom to Area
              </Button>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
}