'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CoveragePoint } from '@/lib/types/network';
import { Badge } from '@/components/ui/badge';
import { Signal, Clock, MapPin, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CoverageDetailsProps {
  point: CoveragePoint | null;
  onClose: () => void;
}

export function CoverageDetails({ point, onClose }: CoverageDetailsProps) {
  if (!point) return null;

  return (
    <Dialog open={!!point} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Coverage Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={point.status.strength > 70 ? "default" : 
                          point.status.strength > 40 ? "secondary" : "destructive"}>
              {point.status.strength}% Signal
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(point.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Signal className="h-4 w-4 text-muted-foreground" />
              <span>
                {point.status.type} - {point.status.technology}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {point.status.coordinates.latitude.toFixed(6)}, 
                {point.status.coordinates.longitude.toFixed(6)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Reported by {point.reportedBy}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Last updated {formatDistanceToNow(new Date(point.updatedAt), { addSuffix: true })}</span>
            </div>
          </div>

          {point.verified && (
            <Badge variant="outline" className="mt-2">
              Verified
            </Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}