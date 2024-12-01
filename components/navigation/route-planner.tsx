'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/lib/hooks/useLocation';
import { MapPin, Navigation as NavIcon } from 'lucide-react';

export function RoutePlanner() {
  const { location } = useLocation();
  const [destination, setDestination] = useState('');

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Route Planner</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Location</p>
            <p className="font-medium">
              {location
                ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                : 'Locating...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <NavIcon className="h-5 w-5 text-primary" />
          <Input
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <Button className="w-full" disabled={!location || !destination}>
          Plan Route
        </Button>
      </div>
    </Card>
  );
}