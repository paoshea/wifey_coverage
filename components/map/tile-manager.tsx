'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useMapTileManager } from '@/lib/hooks/useMapTileManager';
import { Download, Map as MapIcon } from 'lucide-react';
import { useMap } from 'react-leaflet';

export function TileManager() {
  const map = useMap();
  const {
    downloadTilesForArea,
    downloadProgress,
    isDownloading,
    isOffline
  } = useMapTileManager();
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!map) return;
    
    try {
      setError(null);
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      await downloadTilesForArea(bounds, zoom, zoom + 2);
    } catch (err) {
      setError('Failed to download map tiles');
      console.error('Download error:', err);
    }
  };

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] p-4 w-64">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapIcon className="h-4 w-4" />
            <h3 className="font-semibold">Offline Maps</h3>
          </div>
          {isOffline && (
            <span className="text-xs text-yellow-500">Offline Mode</span>
          )}
        </div>

        {isDownloading && (
          <div className="space-y-2">
            <Progress value={downloadProgress} />
            <p className="text-xs text-muted-foreground">
              Downloading map tiles: {downloadProgress.toFixed(1)}%
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <Button
          className="w-full"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? 'Downloading...' : 'Download Current Area'}
        </Button>
      </div>
    </Card>
  );
}