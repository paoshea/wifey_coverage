import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Circle } from 'react-leaflet';
import { useOfflineMap } from '@/lib/hooks/useOfflineMap';
import { useLocation } from '@/lib/hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Locate } from 'lucide-react';
import { RangeSwitcher } from './range-switcher';
import { TileManager } from './tile-manager';
import { HeatmapLayer } from './heatmap-layer';
import { DeadZoneMarker } from './dead-zone-marker';
import { CoordinatesDisplay } from './coordinates-display';
import { LocationMarker } from './location-marker';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { findNearestCoveragePoints } from '@/lib/utils/distance';
import 'leaflet/dist/leaflet.css';
import { LatLng, Map as LeafletMap } from 'leaflet';

function OfflineMapController() {
  const { location } = useLocation();
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 13);
    }
  }, [location, map]);

  return null;
}

function MapControls({ searchRange, setSearchRange }: { searchRange: number; setSearchRange: (value: number) => void }) {
  return (
    <>
      <RangeSwitcher range={searchRange} onChange={setSearchRange} />
      <LocationButton />
    </>
  );
}

function LocationButton() {
  const { location } = useLocation();
  const map = useMap();

  if (!location) return null;

  return (
    <Button
      className="absolute bottom-4 right-4 z-[1000]"
      onClick={() => {
        map.setView([location.latitude, location.longitude], 13);
      }}
    >
      <Locate className="mr-2 h-4 w-4" />
      Find Me
    </Button>
  );
}

export function OfflineMap() {
  const { getTileUrl, isOffline } = useOfflineMap();
  const { location } = useLocation();
  const { coveragePoints } = useCoverageStore();
  const [mounted, setMounted] = useState(false);
  const [searchRange, setSearchRange] = useState(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nearbyPoints = location
    ? findNearestCoveragePoints(location, coveragePoints, searchRange)
    : [];

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full">
      <MapContainer
        center={location ? [location.latitude, location.longitude] : [51.505, -0.09]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url={getTileUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <OfflineMapController />
        <HeatmapLayer />
        <DeadZoneMarker />
        <LocationMarker />
        <CoordinatesDisplay />
        {location && (
          <>
            <Circle
              center={[location.latitude, location.longitude]}
              radius={searchRange * 1000}
              pathOptions={{
                color: 'hsl(var(--primary))',
                fillColor: 'hsl(var(--primary))',
                fillOpacity: 0.1,
              }}
            />
            {nearbyPoints.map(({ point }, index) => (
              <Circle
                key={index}
                center={[
                  point.status.coordinates.latitude,
                  point.status.coordinates.longitude
                ]}
                radius={200}
                pathOptions={{
                  color: point.status.strength > 70 ? 'green' : 
                         point.status.strength > 40 ? 'yellow' : 'red',
                  fillColor: point.status.strength > 70 ? 'green' : 
                            point.status.strength > 40 ? 'yellow' : 'red',
                  fillOpacity: 0.3
                }}
              />
            ))}
          </>
        )}
        <TileManager />
        <MapControls searchRange={searchRange} setSearchRange={setSearchRange} />
      </MapContainer>
    </div>
  );
}