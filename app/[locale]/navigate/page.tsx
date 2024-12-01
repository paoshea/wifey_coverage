'use client';

import dynamic from 'next/dynamic';
import { RoutePlanner } from '@/components/navigation/route-planner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOfflineDetection } from '@/lib/hooks/useOfflineDetection';
import { WifiOff } from 'lucide-react';

const CoverageMap = dynamic(
  () => import('@/components/map/coverage-map').then(mod => mod.CoverageMap),
  { ssr: false }
);

export default function NavigatePage() {
  const isOffline = useOfflineDetection();

  return (
    <div className="container mx-auto p-4 pt-16">
      {isOffline && (
        <Alert className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Limited Navigation</AlertTitle>
          <AlertDescription>
            You are offline. Navigation features may be limited.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-[300px,1fr]">
        <RoutePlanner />
        <div className="h-[calc(100vh-12rem)]">
          <CoverageMap />
        </div>
      </div>
    </div>
  );
}