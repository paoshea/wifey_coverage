'use client';

import { CoverageChart } from '@/components/analytics/coverage-chart';
import { Card } from '@/components/ui/card';
import { useCoverageStore } from '@/lib/store/coverage-store';

export default function AnalyticsPage() {
  const { coveragePoints } = useCoverageStore();

  const averageStrength = coveragePoints.reduce(
    (acc, point) => acc + point.status.strength,
    0
  ) / (coveragePoints.length || 1);

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold mb-4">Network Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Measurements</h3>
          <p className="text-2xl font-bold mt-2">{coveragePoints.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Average Signal Strength</h3>
          <p className="text-2xl font-bold mt-2">{averageStrength.toFixed(1)}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Coverage Quality</h3>
          <p className="text-2xl font-bold mt-2">
            {averageStrength > 70 ? 'Good' : averageStrength > 40 ? 'Fair' : 'Poor'}
          </p>
        </Card>
      </div>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Signal Strength Over Time</h3>
        <CoverageChart />
      </Card>
    </div>
  );
}