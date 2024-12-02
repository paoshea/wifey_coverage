'use client';

import { useEffect, useState, useCallback } from 'react';
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
  points: NetworkStatus[];
}

const CLUSTER_RADIUS = 100; // meters
const MIN_POINTS_FOR_ZONE = 3;

export function DeadZoneMarker() {
  const map = useMap();
  const { coveragePoints } = useCoverageStore();
  const [deadZones, setDeadZones] = useState<DeadZone[]>([]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = φ2 - φ1;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const identifyDeadZones = useCallback((points: NetworkStatus[]): void => {
    const zones: DeadZone[] = [];
    const processed = new Set<number>();

    points.forEach((point, index) => {
      if (processed.has(index)) return;

      const cluster = new Set<NetworkStatus>();
      const clusterIndices = new Set<number>();
      cluster.add(point);
      clusterIndices.add(index);

      points.forEach((otherPoint, otherIndex) => {
        if (index !== otherIndex && !processed.has(otherIndex)) {
          const distance = calculateDistance(
            point.coordinates.latitude,
            point.coordinates.longitude,
            otherPoint.coordinates.latitude,
            otherPoint.coordinates.longitude
          );

          if (distance <= CLUSTER_RADIUS) {
            cluster.add(otherPoint);
            clusterIndices.add(otherIndex);
          }
        }
      });

      if (cluster.size >= MIN_POINTS_FOR_ZONE) {
        const clusterArray = Array.from(cluster);
        const centerLat = clusterArray.reduce((sum, p) => sum + p.coordinates.latitude, 0) / cluster.size;
        const centerLng = clusterArray.reduce((sum, p) => sum + p.coordinates.longitude, 0) / cluster.size;

        zones.push({
          id: `dead-zone-${zones.length}`,
          center: [centerLat, centerLng],
          radius: CLUSTER_RADIUS,
          reportCount: cluster.size,
          lastReported: new Date().toISOString(),
          points: clusterArray
        });

        // Mark all indices in this cluster as processed
        clusterIndices.forEach(idx => processed.add(idx));
      }
    });

    setDeadZones(zones);
  }, []);

  useEffect(() => {
    if (!coveragePoints.length) return;

    const weakPoints = coveragePoints.filter(
      point => point.status.strength < 20
    );

    identifyDeadZones(weakPoints.map(p => p.status));
  }, [coveragePoints, identifyDeadZones]);

  return (
    <>
      {deadZones.map((zone) => (
        <Circle
          key={zone.id}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.3
          }}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-semibold">Dead Zone</h3>
              <p>Points in cluster: {zone.reportCount}</p>
              <Button
                size="sm"
                onClick={() => map.setView(zone.center, 18)}
              >
                Zoom to Zone
              </Button>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
}