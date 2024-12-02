'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import { useGPSTracking } from '@/lib/hooks/useGPSTracking';
import { MapPin, Navigation, History } from 'lucide-react';
import { formatDistance } from 'date-fns';

export function GPSTracker() {
  const {
    currentPosition,
    trackingHistory,
    error,
    isOffline,
    calculateDistance
  } = useGPSTracking({
    enableHighAccuracy: true,
    interval: 5000,
    minDistance: 5 // 5 meters minimum distance
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
        {isOffline && (
          <span className="text-sm text-yellow-500">Offline Mode</span>
        )}
      </div>

      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <>
          {currentPosition && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Accuracy: ±{currentPosition.accuracy.toFixed(1)}m
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="text-sm">Tracking History</span>
            </div>
            <div className="text-sm">
              Points: {trackingHistory.length}
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
          if (currentPosition) {
            const mapElement = document.querySelector('.leaflet-container') as HTMLElement & { _leaflet_map: LeafletMap };
            if (mapElement?._leaflet_map) {
              mapElement._leaflet_map.setView(
                [currentPosition.latitude, currentPosition.longitude],
                mapElement._leaflet_map.getZoom()
              );
            }
          }
        }}
        disabled={!currentPosition}
      >
        Center on Current Location
      </Button>
    </Card>
  );
}