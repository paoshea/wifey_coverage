'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import { useGPSTracking } from '@/lib/hooks/useGPSTracking';
import { MapPin, Navigation, History, Power } from 'lucide-react';
import { formatDistance } from 'date-fns';

export function GPSTracker() {
  const {
    lastPosition,
    trackingHistory,
    error,
    isTracking,
    accuracy,
    storedPoints,
    startTracking,
    stopTracking,
    calculateDistance
  } = useGPSTracking({
    enableHighAccuracy: true,
    minTimeInterval: 5000,
    minDistance: 5, // 5 meters minimum distance
    persistLocally: true
  });

  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    if (trackingHistory.length > 1) {
      const distance = trackingHistory.reduce((total, point, index) => {
        if (index === 0) return 0;
        return total + calculateDistance(trackingHistory[index - 1], point);
      }, 0);
      setTotalDistance(distance);
    }
  }, [trackingHistory, calculateDistance]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          GPS Tracking
        </h3>
        <Button
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={isTracking ? stopTracking : startTracking}
        >
          <Power className="h-4 w-4 mr-2" />
          {isTracking ? 'Stop' : 'Start'} Tracking
        </Button>
      </div>

      {error ? (
        <div className="text-red-500 text-sm">{error.message}</div>
      ) : (
        <>
          {lastPosition && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {lastPosition.latitude.toFixed(6)}, {lastPosition.longitude.toFixed(6)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Accuracy: ±{lastPosition.accuracy?.toFixed(1) || 'unknown'}m
                {accuracy !== 'none' && ` (${accuracy} precision)`}
              </div>
              {lastPosition.altitude && (
                <div className="text-sm text-muted-foreground">
                  Altitude: {lastPosition.altitude.toFixed(1)}m
                  {lastPosition.altitudeAccuracy && ` (±${lastPosition.altitudeAccuracy.toFixed(1)}m)`}
                </div>
              )}
              {lastPosition.speed && (
                <div className="text-sm text-muted-foreground">
                  Speed: {(lastPosition.speed * 3.6).toFixed(1)} km/h
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="text-sm">Tracking History</span>
            </div>
            <div className="text-sm">
              Points: {trackingHistory.length} ({storedPoints} stored locally)
              <br />
              Total Distance: {(totalDistance / 1000).toFixed(2)}km
            </div>
          </div>

          {trackingHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recent Points</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {trackingHistory.slice(-5).reverse().map((point, index) => (
                  <div key={point.timestamp} className="text-xs text-muted-foreground">
                    {formatDistance(point.timestamp, new Date(), { addSuffix: true })}
                    : {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Button
        className="w-full"
        onClick={() => {
          if (lastPosition) {
            const mapElement = document.querySelector('.leaflet-container') as HTMLElement & { _leaflet_map: LeafletMap };
            if (mapElement?._leaflet_map) {
              mapElement._leaflet_map.setView(
                [lastPosition.latitude, lastPosition.longitude],
                mapElement._leaflet_map.getZoom()
              );
            }
          }
        }}
        disabled={!lastPosition}
      >
        Center on Current Location
      </Button>
    </Card>
  );
}