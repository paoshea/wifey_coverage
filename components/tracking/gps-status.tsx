'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Navigation, Signal } from 'lucide-react';

interface GPSStatus {
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  satellites?: number;
}

export function GPSStatus() {
  const [status, setStatus] = useState<GPSStatus | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setStatus({
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          altitude: position.coords.altitude,
          satellites: (position as any).satellites || undefined
        });
      },
      undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!status) return null;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return 'bg-green-500';
    if (accuracy <= 15) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Navigation className="h-4 w-4" />
        <h3 className="font-semibold">GPS Status</h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Accuracy</span>
          <span>±{status.accuracy.toFixed(1)}m</span>
        </div>
        <Progress
          value={Math.max(0, Math.min(100, 100 - (status.accuracy * 5)))}
          className={getAccuracyColor(status.accuracy)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {status.speed !== null && (
          <div>
            <span className="text-muted-foreground">Speed</span>
            <p className="font-medium">{(status.speed * 3.6).toFixed(1)} km/h</p>
          </div>
        )}
        
        {status.heading !== null && (
          <div>
            <span className="text-muted-foreground">Heading</span>
            <p className="font-medium">{status.heading.toFixed(0)}°</p>
          </div>
        )}
        
        {status.altitude !== null && (
          <div>
            <span className="text-muted-foreground">Altitude</span>
            <p className="font-medium">{status.altitude.toFixed(0)}m</p>
          </div>
        )}

        {status.satellites && (
          <div>
            <span className="text-muted-foreground">Satellites</span>
            <p className="font-medium">{status.satellites}</p>
          </div>
        )}
      </div>
    </Card>
  );
}