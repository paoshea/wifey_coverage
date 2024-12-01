'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Upload, Wifi } from 'lucide-react';
import { SpeedTestResult } from '@/lib/types/network';

interface TestCardProps {
  onTest: () => void;
  testing: boolean;
  result: SpeedTestResult | null;
}

export function TestCard({ onTest, testing, result }: TestCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Speed Test</h2>
        <Button onClick={onTest} disabled={testing}>
          {testing ? 'Testing...' : 'Start Test'}
        </Button>
      </div>

      {testing && (
        <div className="space-y-4">
          <Progress value={Math.random() * 100} />
          <p className="text-center text-sm text-muted-foreground">
            Testing network speed...
          </p>
        </div>
      )}

      {result && !testing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Download</p>
              <p className="text-xl font-bold">
                {result.downloadSpeed.toFixed(2)} Mbps
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Upload</p>
              <p className="text-xl font-bold">
                {result.uploadSpeed.toFixed(2)} Mbps
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Latency</p>
              <p className="text-xl font-bold">{result.latency.toFixed(0)} ms</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}