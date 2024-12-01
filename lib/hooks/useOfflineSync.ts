'use client';

import { useState, useEffect } from 'react';
import { offlineSync } from '@/lib/services/offline-sync';
import { useOfflineDetection } from './useOfflineDetection';

export const useOfflineSync = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const isOffline = useOfflineDetection();

  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await offlineSync.getPendingCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    pendingCount,
    isOffline,
    clearQueue: offlineSync.clearQueue
  };
};