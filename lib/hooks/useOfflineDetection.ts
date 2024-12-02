'use client';

import { useState, useEffect } from 'react';

export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};