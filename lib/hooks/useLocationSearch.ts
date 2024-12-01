'use client';

import { useState } from 'react';
import { CoveragePoint } from '@/lib/types/network';
import { calculateDistance } from '@/lib/utils/distance';

interface SearchResult {
  point: CoveragePoint;
  distance: number;
}

export const useLocationSearch = (coveragePoints: CoveragePoint[]) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = async (
    latitude: number,
    longitude: number,
    radius: number = 5 // Default 5km radius
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const nearby = coveragePoints
        .map(point => ({
          point,
          distance: calculateDistance(
            latitude,
            longitude,
            point.status.coordinates.latitude,
            point.status.coordinates.longitude
          )
        }))
        .filter(result => result.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setResults(nearby);
    } catch (err) {
      setError('Failed to search nearby points');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchByAddress = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const data = await response.json();
      
      if (data.length === 0) {
        setError('Location not found');
        setResults([]);
        return;
      }

      const { lat, lon } = data[0];
      await searchNearby(parseFloat(lat), parseFloat(lon));
    } catch (err) {
      setError('Failed to search location');
      console.error('Geocoding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchNearby,
    searchByAddress,
    clearResults
  };
};