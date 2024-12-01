'use client';

import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { NetworkStatus, CoveragePoint } from '@/lib/types/network';

interface StorageKeys {
  COVERAGE_POINTS: string;
  GPS_TRACKS: string;
  MAP_TILES: string;
}

const STORAGE_KEYS: StorageKeys = {
  COVERAGE_POINTS: 'offline-coverage-points',
  GPS_TRACKS: 'offline-gps-tracks',
  MAP_TILES: 'offline-map-tiles',
};

export const useOfflineStorage = () => {
  const [initialized, setInitialized] = useState(false);
  const [storageSize, setStorageSize] = useState<number>(0);

  useEffect(() => {
    const initStorage = async () => {
      await localforage.config({
        name: 'network-coverage-tracker',
        version: 1.0,
        storeName: 'offline-data',
        description: 'Offline storage for network coverage data'
      });
      setInitialized(true);
      await updateStorageSize();
    };

    initStorage();
  }, []);

  const updateStorageSize = async () => {
    try {
      const keys = await localforage.keys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await localforage.getItem(key);
        totalSize += new Blob([JSON.stringify(value)]).size;
      }
      
      setStorageSize(totalSize);
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
  };

  const saveCoveragePoint = async (point: CoveragePoint) => {
    if (!initialized) return;
    
    try {
      const points = await localforage.getItem<CoveragePoint[]>(STORAGE_KEYS.COVERAGE_POINTS) || [];
      points.push(point);
      await localforage.setItem(STORAGE_KEYS.COVERAGE_POINTS, points);
      await updateStorageSize();
    } catch (error) {
      console.error('Error saving coverage point:', error);
      throw error;
    }
  };

  const saveGPSTrack = async (track: { lat: number; lng: number; timestamp: number }) => {
    if (!initialized) return;
    
    try {
      const tracks = await localforage.getItem<Array<typeof track>>(STORAGE_KEYS.GPS_TRACKS) || [];
      tracks.push(track);
      await localforage.setItem(STORAGE_KEYS.GPS_TRACKS, tracks);
      await updateStorageSize();
    } catch (error) {
      console.error('Error saving GPS track:', error);
      throw error;
    }
  };

  const clearOldData = async (olderThan: number = 7 * 24 * 60 * 60 * 1000) => {
    if (!initialized) return;
    
    try {
      const now = Date.now();
      
      // Clear old coverage points
      const points = await localforage.getItem<CoveragePoint[]>(STORAGE_KEYS.COVERAGE_POINTS) || [];
      const filteredPoints = points.filter(point => 
        now - new Date(point.createdAt).getTime() < olderThan
      );
      await localforage.setItem(STORAGE_KEYS.COVERAGE_POINTS, filteredPoints);
      
      // Clear old GPS tracks
      const tracks = await localforage.getItem<Array<{ timestamp: number }>>(STORAGE_KEYS.GPS_TRACKS) || [];
      const filteredTracks = tracks.filter(track => 
        now - track.timestamp < olderThan
      );
      await localforage.setItem(STORAGE_KEYS.GPS_TRACKS, filteredTracks);
      
      await updateStorageSize();
    } catch (error) {
      console.error('Error clearing old data:', error);
      throw error;
    }
  };

  return {
    initialized,
    storageSize,
    saveCoveragePoint,
    saveGPSTrack,
    clearOldData,
  };
};