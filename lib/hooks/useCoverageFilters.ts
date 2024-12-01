'use client';

import { useState, useCallback } from 'react';
import { CoveragePoint } from '@/lib/types/network';
import { CoverageFilters } from '@/components/map/coverage-filters';

export const useCoverageFilters = (points: CoveragePoint[]) => {
  const [filters, setFilters] = useState<CoverageFilters>({
    minStrength: 0,
    networkType: 'all',
    provider: 'all',
    timeRange: 24,
  });

  const filteredPoints = useCallback(() => {
    const now = Date.now();
    const timeThreshold = now - (filters.timeRange * 60 * 60 * 1000);

    return points.filter(point => {
      const createdAt = new Date(point.createdAt).getTime();
      
      return (
        point.status.strength >= filters.minStrength &&
        (filters.networkType === 'all' || point.status.type === filters.networkType) &&
        (filters.provider === 'all' || point.status.provider === filters.provider) &&
        createdAt >= timeThreshold
      );
    });
  }, [points, filters]);

  return {
    filters,
    setFilters,
    filteredPoints: filteredPoints()
  };
};