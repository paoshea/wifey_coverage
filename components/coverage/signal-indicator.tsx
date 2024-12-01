'use client';

import { Signal as SignalIcon, Wifi } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { NetworkStatus } from '@/lib/types/network';

interface SignalIndicatorProps {
  status: NetworkStatus | null;
}

export function SignalIndicator({ status }: SignalIndicatorProps) {
  if (!status) return null;

  const getSignalColor = (strength: number) => {
    if (strength >= 70) return 'bg-green-500';
    if (strength >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {status.type === 'cellular' ? (
          <SignalIcon className="h-5 w-5" />
        ) : (
          <Wifi className="h-5 w-5" />
        )}
        <span className="font-medium">{status.type === 'cellular' ? status.technology : 'WiFi'}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Signal Strength</span>
          <span>{status.strength}%</span>
        </div>
        <Progress
          value={status.strength}
          className={getSignalColor(status.strength)}
        />
      </div>
    </div>
  );
}