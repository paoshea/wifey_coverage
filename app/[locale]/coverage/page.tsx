'use client';

import dynamic from 'next/dynamic';
import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';
import { Card } from '@/components/ui/card';
import { SignalIndicator } from '@/components/coverage/signal-indicator';
import { Signal, Wifi } from 'lucide-react';

const CoverageMap = dynamic(
  () => import('@/components/map/coverage-map').then(mod => mod.CoverageMap),
  { ssr: false }
);

export default function CoveragePage() {
  const { status, loading } = useNetworkStatus();

  return (
    <div className="container mx-auto p-4 pt-16">
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            {status?.type === 'cellular' ? <Signal /> : <Wifi />}
            <h3 className="text-lg font-semibold">Network Type</h3>
          </div>
          <p className="mt-2">{status?.type || 'Unknown'}</p>
        </Card>
        <Card className="p-4">
          <SignalIndicator status={status} />
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Signal />
            <h3 className="text-lg font-semibold">Technology</h3>
          </div>
          <p className="mt-2">{status?.technology || 'Unknown'}</p>
        </Card>
      </div>
      <CoverageMap />
    </div>
  );
}