'use client';

import { useState } from 'react';
import { SpeedTestResult } from '@/lib/types/network';
import { useNetworkStatus } from './useNetworkStatus';

export const useSpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const { status } = useNetworkStatus();

  const runTest = async () => {
    setTesting(true);
    try {
      // Simulate speed test - in production, use actual speed test API
      const downloadSpeed = Math.random() * 100;
      const uploadSpeed = Math.random() * 50;
      const latency = Math.random() * 100;
      
      const testResult: SpeedTestResult = {
        id: crypto.randomUUID(),
        downloadSpeed,
        uploadSpeed,
        latency,
        jitter: Math.random() * 20,
        timestamp: Date.now(),
        location: status?.coordinates || { latitude: 0, longitude: 0 },
        networkStatus: status || {
          type: 'cellular',
          strength: 0,
          timestamp: Date.now(),
          coordinates: { latitude: 0, longitude: 0 }
        }
      };
      
      setResult(testResult);
    } finally {
      setTesting(false);
    }
  };

  return { runTest, testing, result };
};