import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { NetworkStatus, CoveragePoint } from '@/lib/types/network';
import { CompressionService } from '@/lib/services/compression';

export const coveragePointToGeoJSON = (point: CoveragePoint): Feature<Point> => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [point.status.coordinates.longitude, point.status.coordinates.latitude]
  },
  properties: {
    id: point.id,
    strength: point.status.strength,
    type: point.status.type,
    technology: point.status.technology,
    timestamp: point.status.timestamp,
    reportedBy: point.reportedBy,
    verified: point.verified
  }
});

export const coveragePointsToGeoJSON = (points: CoveragePoint[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: points.map(coveragePointToGeoJSON)
});

export const exportCoverageData = async (points: CoveragePoint[]): Promise<string> => {
  const geojson = coveragePointsToGeoJSON(points);
  const compressed = CompressionService.compress(geojson);
  return compressed;
};

export const importCoverageData = async (data: string): Promise<CoveragePoint[]> => {
  try {
    const decompressed = CompressionService.decompress(data);
    if (!decompressed || !decompressed.features) {
      throw new Error('Invalid coverage data format');
    }

    return decompressed.features.map((feature: Feature) => ({
      id: feature.properties?.id || crypto.randomUUID(),
      status: {
        type: feature.properties?.type || 'cellular',
        strength: feature.properties?.strength || 0,
        technology: feature.properties?.technology,
        timestamp: feature.properties?.timestamp || Date.now(),
        coordinates: {
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        }
      },
      reportedBy: feature.properties?.reportedBy || 'unknown',
      verified: feature.properties?.verified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error importing coverage data:', error);
    throw new Error('Failed to import coverage data');
  }
};