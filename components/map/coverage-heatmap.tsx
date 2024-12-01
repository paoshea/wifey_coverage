'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useCoverageStore } from '@/lib/store/coverage-store';

declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: any
  ): any;
}

export function CoverageHeatmap() {
  const { coveragePoints } = useCoverageStore();
  const map = useMap();

  useEffect(() => {
    if (!map || !coveragePoints.length) return;

    const points = coveragePoints.map(point => [
      point.status.coordinates.latitude,
      point.status.coordinates.longitude,
      point.status.strength / 100
    ]) as [number, number, number][];

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: '#blue',
        0.6: '#yellow',
        0.8: '#orange',
        1.0: '#red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, coveragePoints]);

  return null;
}