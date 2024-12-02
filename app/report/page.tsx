'use client';

import { Card } from '@/components/ui/card';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';

export default function ReportPage() {
  const { coveragePoints } = useCoverageStore();

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalPoints: coveragePoints.length,
      coveragePoints: coveragePoints.map(point => ({
        timestamp: point.timestamp,
        location: point.location,
        status: {
          strength: point.status.strength,
          speed: point.status.speed,
          latency: point.status.latency,
          provider: point.status.provider,
          connectionType: point.status.connectionType
        }
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });

    saveAs(blob, `network-coverage-report-${new Date().toISOString()}.json`);
  };

  const averageStrength = coveragePoints.length > 0
    ? Math.round(
        coveragePoints.reduce((acc, point) => acc + point.status.strength, 0) /
        coveragePoints.length
      )
    : 0;

  const averageSpeed = coveragePoints.length > 0
    ? Math.round(
        coveragePoints.reduce((acc, point) => acc + (point.status.speed || 0), 0) /
        coveragePoints.length
      )
    : 0;

  const averageLatency = coveragePoints.length > 0
    ? Math.round(
        coveragePoints.reduce((acc, point) => acc + (point.status.latency || 0), 0) /
        coveragePoints.length
      )
    : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Network Coverage Report</h1>
        <Button onClick={downloadReport}>
          Download Report
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Coverage Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Data Points</p>
              <p className="text-2xl font-bold">{coveragePoints.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Signal Strength</p>
              <p className="text-2xl font-bold">{averageStrength}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Speed</p>
              <p className="text-2xl font-bold">{averageSpeed} Mbps</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Latency</p>
              <p className="text-2xl font-bold">{averageLatency} ms</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Network Providers</h2>
          <div className="space-y-4">
            {Array.from(new Set(coveragePoints.map(point => point.status.provider)))
              .map(provider => {
                const pointsForProvider = coveragePoints.filter(
                  point => point.status.provider === provider
                );
                const percentage = Math.round(
                  (pointsForProvider.length / coveragePoints.length) * 100
                );

                return (
                  <div key={provider}>
                    <p className="text-sm text-muted-foreground">{provider || 'Unknown'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Types</h2>
          <div className="space-y-4">
            {Array.from(new Set(coveragePoints.map(point => point.status.connectionType)))
              .map(type => {
                const pointsForType = coveragePoints.filter(
                  point => point.status.connectionType === type
                );
                const percentage = Math.round(
                  (pointsForType.length / coveragePoints.length) * 100
                );

                return (
                  <div key={type}>
                    <p className="text-sm text-muted-foreground">{type || 'Unknown'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Measurements</h2>
          <div className="space-y-4">
            {coveragePoints.slice(-5).reverse().map((point, index) => (
              <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                <p className="text-sm text-muted-foreground">
                  {new Date(point.timestamp).toLocaleString()}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Strength</p>
                    <p className="font-medium">{point.status.strength}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Speed</p>
                    <p className="font-medium">{point.status.speed || 0} Mbps</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="font-medium">{point.status.latency || 0} ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
