'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';

interface TrackPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export function TrackList({ tracks }: { tracks: TrackPoint[] }) {
  const [groupedTracks, setGroupedTracks] = useState<{
    [key: string]: TrackPoint[];
  }>({});

  useEffect(() => {
    const grouped = tracks.reduce((acc, track) => {
      const date = new Date(track.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(track);
      return acc;
    }, {} as { [key: string]: TrackPoint[] });
    
    setGroupedTracks(grouped);
  }, [tracks]);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Tracking History</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {Object.entries(groupedTracks).map(([date, points]) => (
            <div key={date} className="space-y-2">
              <div className="sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                <Badge variant="outline">{date}</Badge>
              </div>
              {points.map((point, index) => (
                <div
                  key={point.timestamp}
                  className="flex items-start space-x-2 text-sm"
                >
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="text-muted-foreground">
                      {formatDistanceToNow(point.timestamp, { addSuffix: true })}
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}