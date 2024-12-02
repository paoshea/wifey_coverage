'use client';

import dynamic from 'next/dynamic';
import { GPSTracker } from '@/components/tracking/gps-tracker';
import { GPSStatus } from '@/components/tracking/gps-status';
import { DistanceCalculator } from '@/components/coverage/distance-calculator';
import { StorageInfo } from '@/components/tracking/storage-info';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOfflineDetection } from '@/lib/hooks/useOfflineDetection';
import { WifiOff } from 'lucide-react';

const OfflineMap = dynamic(
  () => import('@/components/map/offline-map').then(mod => mod.OfflineMap),
  { ssr: false }
);

export default function OfflinePage() {
  const isOffline = useOfflineDetection();

  return (
    <div className="container mx-auto p-4 pt-16">
      {isOffline && (
        <Alert className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Offline Mode Active</AlertTitle>
          <AlertDescription>
            Your location data is being stored locally and will sync when you&apos;re back online.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-[300px,1fr]">
        <div className="space-y-4">
          <GPSTracker />
          <GPSStatus />
          <DistanceCalculator />
          <StorageInfo />
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <OfflineMap />
        </div>
      </div>
    </div>
  );
}
