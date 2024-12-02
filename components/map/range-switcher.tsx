'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMap } from 'react-leaflet';

interface RangeSwitcherProps {
  range: number;
  onChange: (value: number) => void;
}

export function RangeSwitcher({ range, onChange }: RangeSwitcherProps) {
  const map = useMap();
  const ranges = [0.5, 1, 2, 5, 10, 20, 50];

  const handleZoom = (direction: 'in' | 'out') => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + (direction === 'in' ? 1 : -1));
  };

  return (
    <Card className="absolute top-4 right-4 z-[1000] p-4 w-72">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Label>Search Range: {range}km</Label>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleZoom('in')}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleZoom('out')}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Slider
          min={0}
          max={ranges.length - 1}
          step={1}
          value={[ranges.indexOf(range)]}
          onValueChange={(value) => onChange(ranges[value[0]])}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          {ranges.map((r) => (
            <span key={r}>{r}km</span>
          ))}
        </div>
      </div>
    </Card>
  );
}