'use client';

import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { tileCache } from '@/lib/services/tile-cache';
import { useOfflineDetection } from './useOfflineDetection';

export const useOfflineMap = () => {
  const [offlineTiles, setOfflineTiles] = useState<Map<string, string>>(new Map());
  const [tileLoadError, setTileLoadError] = useState<string | null>(null);
  const isOffline = useOfflineDetection();

  useEffect(() => {
    const loadCachedTiles = async () => {
      if (!isOffline) return;

      try {
        const tiles = new Map<string, string>();
        const keys = await localforage.keys();
        
        for (const key of keys) {
          if (key.includes('tile-')) {
            const tile = await tileCache.getTile(key);
            if (tile) {
              tiles.set(key, URL.createObjectURL(tile));
            }
          }
        }

        setOfflineTiles(tiles);
        setTileLoadError(null);
      } catch (error) {
        console.error('Error loading cached tiles:', error);
        setTileLoadError('Failed to load offline map tiles');
      }
    };

    loadCachedTiles();

    return () => {
      offlineTiles.forEach(url => URL.revokeObjectURL(url));
    };
  }, [isOffline, offlineTiles]);

  const getTileUrl = (baseUrl: string) => {
    if (!isOffline) return baseUrl;

    const cachedUrl = offlineTiles.get(`tile-${baseUrl}`);
    return cachedUrl || baseUrl;
  };

  return {
    getTileUrl,
    isOffline,
    tileLoadError,
    offlineTilesCount: offlineTiles.size
  };
};