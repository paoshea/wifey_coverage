'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateDistance } from '@/lib/utils/distance';
import { useLocation } from '@/lib/hooks/useLocation';
import { MapPin } from 'lucide-react';

export function DistanceCalculator() {
  const { location } = useLocation();
  const [targetCoords, setTargetCoords] = useState({ lat: 0, lng: 0 });
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (location && targetCoords.lat && targetCoords.lng) {
      const dist = calculateDistance(
        location.latitude,
        location.longitude,
        targetCoords.lat,
        targetCoords.lng
      );
      setDistance(dist);
    }
  }, [location, targetCoords]);

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Distance Calculator
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Target Latitude"
          value={targetCoords.lat || ''}
          onChange={(e) => setTargetCoords(prev => ({
            ...prev,
            lat: parseFloat(e.target.value) || 0
          }))}
        />
        <Input
          type="number"
          placeholder="Target Longitude"
          value={targetCoords.lng || ''}
          onChange={(e) => setTargetCoords(prev => ({
            ...prev,
            lng: parseFloat(e.target.value) || 0
          }))}
        />
      </div>

      {location && (
        <div className="text-sm text-muted-foreground">
          Your location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
      )}

      {distance !== null && (
        <div className="text-lg font-semibold">
          Distance: {distance.toFixed(2)} km
        </div>
      )}

      <Button
        className="w-full"
        disabled={!location || !targetCoords.lat || !targetCoords.lng}
        onClick={() => {
          if (location) {
            const dist = calculateDistance(
              location.latitude,
              location.longitude,
              targetCoords.lat,
              targetCoords.lng
            );
            setDistance(dist);
          }
        }}
      >
        Calculate Distance
      </Button>
    </Card>
  );
}