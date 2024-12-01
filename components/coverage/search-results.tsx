'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CoveragePoint } from '@/lib/types/network';
import { Signal, MapPin, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SearchResultsProps {
  results: Array<{
    point: CoveragePoint;
    distance: number;
  }>;
  onClose: () => void;
  onSelect: (point: CoveragePoint) => void;
}

export function SearchResults({ results, onClose, onSelect }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <Card className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Search Results</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {results.map(({ point, distance }) => (
            <Card
              key={point.id}
              className="p-3 cursor-pointer hover:bg-accent"
              onClick={() => onSelect(point)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Signal className="h-4 w-4" />
                    <span className="font-medium">
                      {point.status.strength}% Signal
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{distance.toFixed(2)} km away</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reported {formatDistanceToNow(new Date(point.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {point.status.type === 'cellular' ? point.status.technology : 'WiFi'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}