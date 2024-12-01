'use client';

import { useEffect } from 'react';
import { networkMonitor } from '@/lib/services/network-monitor';
import { useNetworkStatus } from './useNetworkStatus';

export const useNetworkMonitor = () => {
  const { status } = useNetworkStatus();

  useEffect(() => {
    networkMonitor.startMonitoring();
    return () => networkMonitor.stopMonitoring();
  }, []);

  return { status };
};