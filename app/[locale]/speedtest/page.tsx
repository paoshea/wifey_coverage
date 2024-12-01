'use client';

import { TestCard } from '@/components/speed-test/test-card';
import { useSpeedTest } from '@/lib/hooks/useSpeedTest';

export default function SpeedTestPage() {
  const { runTest, testing, result } = useSpeedTest();

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold mb-6">Network Speed Test</h1>
      <TestCard onTest={runTest} testing={testing} result={result} />
    </div>
  );
}