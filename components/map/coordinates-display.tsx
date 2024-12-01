'use client';

import { useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function CoordinatesDisplay() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  useMapEvents({
    mousemove(e) {
      setPosition(e.latlng);
    },
    mouseout() {
      setPosition(null);
    }
  });

  if (!position) return null;

  return (
    <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] p-2">
      <div className="flex items-center space-x-2 text-sm">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>
          {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </span>
      </div>
    </Card>
  );
}