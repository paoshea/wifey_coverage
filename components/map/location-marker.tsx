'use client';

import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '@/lib/hooks/useLocation';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { findNearestCoveragePoints } from '@/lib/utils/distance';

// Custom marker icon for current location
const locationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jcm9zc2hhaXIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PGxpbmUgeDE9IjIyIiB5MT0iMTIiIHgyPSIxOCIgeTI9IjEyIi8+PGxpbmUgeDE9IjYiIHkxPSIxMiIgeDI9IjIiIHkyPSIxMiIvPjxsaW5lIHgxPSIxMiIgeTE9IjYiIHgyPSIxMiIgeTI9IjIiLz48bGluZSB4MT0iMTIiIHkxPSIyMiIgeDI9IjEyIiB5Mj0iMTgiLz48L3N2Zz4=',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

export function LocationMarker() {
  const { location } = useLocation();
  const { coveragePoints } = useCoverageStore();
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], map.getZoom());
    }
  }, [location, map]);

  if (!location) return null;

  const nearestPoints = findNearestCoveragePoints(
    location,
    coveragePoints,
    5 // 5km radius
  );

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={locationIcon}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold mb-2">Your Location</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
          {nearestPoints.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold mb-1">Nearest Coverage Points:</h4>
              <ul className="text-sm space-y-1">
                {nearestPoints.slice(0, 3).map((point, index) => (
                  <li key={index}>
                    {point.distance.toFixed(2)}km away ({point.point.status.strength}% signal)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}