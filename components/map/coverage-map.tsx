'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';
import { Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function MapController() {
  const { status } = useNetworkStatus();
  const map = useMap();

  useEffect(() => {
    if (status?.coordinates) {
      map.setView(
        new LatLng(status.coordinates.latitude, status.coordinates.longitude),
        13
      );
    }
  }, [status, map]);

  return null;
}

export function CoverageMap() {
  const { status } = useNetworkStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapController />
        {status && (
          <Circle
            center={[status.coordinates.latitude, status.coordinates.longitude]}
            radius={200}
            pathOptions={{
              color: status.strength > 70 ? 'green' : 
                     status.strength > 40 ? 'yellow' : 'red',
              fillColor: status.strength > 70 ? 'green' : 
                        status.strength > 40 ? 'yellow' : 'red',
              fillOpacity: 0.3
            }}
          />
        )}
      </MapContainer>
      <Button
        className="absolute bottom-4 right-4 z-[1000]"
        onClick={() => {
          if (status?.coordinates) {
            const map = document.querySelector('.leaflet-container')?._leaflet_map;
            if (map) {
              map.setView(
                [status.coordinates.latitude, status.coordinates.longitude],
                map.getZoom()
              );
            }
          }
        }}
        disabled={!status}
      >
        <Locate className="mr-2 h-4 w-4" />
        Find Me
      </Button>
    </div>
  );
}