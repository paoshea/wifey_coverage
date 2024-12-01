'use client';

import { useState, useEffect } from 'react';
import { tileCache } from '@/lib/services/tile-cache';
import { useOfflineDetection } from './useOfflineDetection';

interface TileCoordinates {
  x: number;
  y: number;
  z: number;
}

export const useMapTileManager = () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const isOffline = useOfflineDetection();

  const downloadTilesForArea = async (
    bounds: L.LatLngBounds,
    minZoom: number,
    maxZoom: number
  ) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const tiles: TileCoordinates[] = [];
      
      // Calculate tile coordinates for the area
      for (let z = minZoom; z <= maxZoom; z++) {
        const northEastTile = latLngToTile(bounds.getNorthEast(), z);
        const southWestTile = latLngToTile(bounds.getSouthWest(), z);
        
        for (let x = southWestTile.x; x <= northEastTile.x; x++) {
          for (let y = northEastTile.y; y <= southWestTile.y; y++) {
            tiles.push({ x, y, z });
          }
        }
      }

      let downloaded = 0;
      const total = tiles.length;

      for (const tile of tiles) {
        const url = getTileUrl(tile);
        if (!(await tileCache.getTile(url))) {
          const response = await fetch(url);
          const blob = await response.blob();
          await tileCache.setTile(url, blob);
        }
        
        downloaded++;
        setDownloadProgress((downloaded / total) * 100);
      }
    } catch (error) {
      console.error('Error downloading map tiles:', error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const latLngToTile = (latLng: L.LatLng, zoom: number) => {
    const lat = latLng.lat;
    const lng = latLng.lng;
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 
      1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return { x, y, z: zoom };
  };

  const getTileUrl = (tile: TileCoordinates): string => {
    return `https://a.tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`;
  };

  return {
    downloadTilesForArea,
    downloadProgress,
    isDownloading,
    isOffline
  };
};