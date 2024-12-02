import { Feature, FeatureCollection, Point, Polygon, GeoJsonProperties } from 'geojson';
import { NetworkStatus, CoveragePoint } from '@/lib/types/network';
import { CompressionService } from '../services/compression';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    signal: number;
    timestamp: number;
    type?: 'cellular' | 'wifi';
    strength?: number;
    provider?: string;
    technology?: '3G' | '4G' | '5G';
    reportedBy?: string;
    verified?: boolean;
    [key: string]: any;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export const coveragePointToGeoJSON = (point: CoveragePoint): Feature<Point> => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [point.status.coordinates.longitude, point.status.coordinates.latitude]
  },
  properties: {
    signal: point.status.strength,
    timestamp: point.status.timestamp,
    type: point.status.type,
    technology: point.status.technology,
    provider: point.status.provider,
    reportedBy: point.reportedBy,
    verified: point.verified
  }
});

export const exportCoverageData = async (points: CoveragePoint[]): Promise<string> => {
  const geojson: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: points.map(coveragePointToGeoJSON)
  };

  const compressed = CompressionService.compress(geojson);
  return compressed;
};

export const importCoverageData = async (data: string): Promise<CoveragePoint[]> => {
  try {
    const decompressed = CompressionService.decompress<GeoJSONFeatureCollection>(data);
    if (!decompressed || !decompressed.features) {
      throw new Error('Invalid coverage data format');
    }

    return decompressed.features.map(feature => {
      if (feature.geometry.type !== 'Point') {
        throw new Error('Invalid geometry type: expected Point');
      }

      const status: NetworkStatus = {
        type: feature.properties?.type || 'cellular',
        strength: feature.properties?.signal || -1,
        technology: feature.properties?.technology,
        provider: feature.properties?.provider,
        timestamp: feature.properties?.timestamp || Date.now(),
        coordinates: {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        }
      };

      return {
        id: crypto.randomUUID(),
        status,
        reportedBy: feature.properties?.reportedBy || 'unknown',
        verified: feature.properties?.verified || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error importing coverage data:', error);
    throw new Error('Failed to import coverage data');
  }
};

export function validateCoverageData(data: string): boolean {
  if (!data) {
    return false;
  }

  try {
    const decompressed = CompressionService.decompress<GeoJSONFeatureCollection>(data);
    if (!decompressed || !decompressed.features) {
      throw new Error('Invalid coverage data format');
    }

    return decompressed.features.every(feature => 
      feature.type === 'Feature' &&
      feature.geometry?.type === 'Point' &&
      Array.isArray(feature.geometry.coordinates) &&
      feature.geometry.coordinates.length === 2 &&
      typeof feature.properties?.signal === 'number' &&
      typeof feature.properties?.timestamp === 'number'
    );
  } catch (error) {
    console.error('Coverage data validation error:', error);
    return false;
  }
}

export function mergeCoverageData(data1: string, data2: string): string {
  try {
    const geojson1 = CompressionService.decompress<GeoJSONFeatureCollection>(data1);
    const geojson2 = CompressionService.decompress<GeoJSONFeatureCollection>(data2);

    if (!geojson1 || !geojson2) {
      throw new Error('Invalid coverage data format');
    }

    const merged: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features: [...geojson1.features, ...geojson2.features]
    };

    return CompressionService.compress(merged);
  } catch (error) {
    console.error('Coverage data merge error:', error);
    throw error;
  }
}

export function filterCoverageByDate(data: string, startDate: Date, endDate: Date): string {
  try {
    const geojson = CompressionService.decompress<GeoJSONFeatureCollection>(data);
    if (!geojson) {
      throw new Error('Invalid coverage data format');
    }

    const filtered: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features: geojson.features.filter(feature => {
        const timestamp = feature.properties.timestamp;
        return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
      })
    };

    return CompressionService.compress(filtered);
  } catch (error) {
    console.error('Coverage data filter error:', error);
    throw error;
  }
}