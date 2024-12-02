'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  connectionType: string;
  provider: string;
}

export default function SpeedTestPage() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'download' | 'upload' | 'latency'>('idle');
  const [result, setResult] = useState<SpeedTestResult | null>(null);

  // Function to measure latency
  const measureLatency = async (): Promise<number> => {
    const start = performance.now();
    try {
      await fetch('https://www.google.com/favicon.ico', { cache: 'no-store' });
      const end = performance.now();
      return end - start;
    } catch (error) {
      console.error('Error measuring latency:', error);
      return 0;
    }
  };

  // Function to measure download speed
  const measureDownloadSpeed = async (): Promise<number> => {
    const fileSize = 1024 * 1024; // 1MB
    const testFile = 'https://speed.cloudflare.com/cdn-cgi/trace'; // Small test file
    
    try {
      const startTime = performance.now();
      const response = await fetch(testFile + '?r=' + Math.random(), { cache: 'no-store' });
      const data = await response.text();
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsLoaded = fileSize * 8;
      const speedBps = bitsLoaded / durationInSeconds;
      const speedMbps = speedBps / (1024 * 1024);
      
      return Math.round(speedMbps * 100) / 100;
    } catch (error) {
      console.error('Error measuring download speed:', error);
      return 0;
    }
  };

  // Function to measure upload speed
  const measureUploadSpeed = async (): Promise<number> => {
    const dataSize = 1024 * 1024; // 1MB
    const testData = new Blob([new ArrayBuffer(dataSize)]);
    
    try {
      const startTime = performance.now();
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: testData,
      });
      const endTime = performance.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsUploaded = dataSize * 8;
      const speedBps = bitsUploaded / durationInSeconds;
      const speedMbps = speedBps / (1024 * 1024);
      
      return Math.round(speedMbps * 100) / 100;
    } catch (error) {
      console.error('Error measuring upload speed:', error);
      return 0;
    }
  };

  // Get connection information
  const getConnectionInfo = () => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    return {
      type: connection?.effectiveType || 'unknown',
      provider: connection?.carrier || 'unknown'
    };
  };

  const runSpeedTest = async () => {
    setIsTestRunning(true);
    setProgress(0);
    setCurrentPhase('latency');

    try {
      // Measure latency
      setProgress(10);
      const latency = await measureLatency();
      
      // Measure download speed
      setCurrentPhase('download');
      setProgress(30);
      const downloadSpeed = await measureDownloadSpeed();
      
      // Measure upload speed
      setCurrentPhase('upload');
      setProgress(60);
      const uploadSpeed = await measureUploadSpeed();
      
      // Get connection info
      setProgress(90);
      const connectionInfo = getConnectionInfo();
      
      // Set final result
      setProgress(100);
      setResult({
        downloadSpeed,
        uploadSpeed,
        latency,
        connectionType: connectionInfo.type,
        provider: connectionInfo.provider
      });

      toast.success('Speed test completed successfully');
    } catch (error) {
      console.error('Speed test error:', error);
      toast.error('Failed to complete speed test');
    } finally {
      setIsTestRunning(false);
      setCurrentPhase('idle');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Network Speed Test</h1>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Test Your Connection</h2>
            <p className="text-sm text-muted-foreground">
              Measure your current network performance
            </p>
          </div>

          {isTestRunning ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {currentPhase === 'latency' && 'Measuring latency...'}
                  {currentPhase === 'download' && 'Testing download speed...'}
                  {currentPhase === 'upload' && 'Testing upload speed...'}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          ) : (
            <Button onClick={runSpeedTest} disabled={isTestRunning}>
              Start Speed Test
            </Button>
          )}
        </div>
      </Card>

      {result && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Download Speed</p>
              <p className="text-2xl font-bold">{result.downloadSpeed} Mbps</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Upload Speed</p>
              <p className="text-2xl font-bold">{result.uploadSpeed} Mbps</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Latency</p>
              <p className="text-2xl font-bold">{Math.round(result.latency)} ms</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Connection Type</p>
              <p className="text-2xl font-bold capitalize">{result.connectionType}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">About Speed Test</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            This speed test measures your network performance in three key areas:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-medium">Download Speed:</span> How quickly your device can receive data from the internet
            </li>
            <li>
              <span className="font-medium">Upload Speed:</span> How quickly your device can send data to the internet
            </li>
            <li>
              <span className="font-medium">Latency:</span> The time it takes for data to travel between your device and our servers
            </li>
          </ul>
          <p>
            Results may vary based on your current network conditions, server load, and other factors.
          </p>
        </div>
      </Card>
    </div>
  );
}
