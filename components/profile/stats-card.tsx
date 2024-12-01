'use client';

import { Card } from '@/components/ui/card';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { Signal, Map, AlertTriangle } from 'lucide-react';

export function StatsCard() {
  const { coveragePoints } = useCoverageStore();

  const stats = {
    totalPoints: coveragePoints.length,
    avgStrength: coveragePoints.reduce((acc, point) => acc + point.status.strength, 0) / 
                 (coveragePoints.length || 1),
    issues: coveragePoints.filter(point => point.status.strength < 40).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Signal className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Measurements</p>
            <p className="text-2xl font-bold">{stats.totalPoints}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Average Strength</p>
            <p className="text-2xl font-bold">{stats.avgStrength.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Issues Reported</p>
            <p className="text-2xl font-bold">{stats.issues}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}