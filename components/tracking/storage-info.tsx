'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, Trash2 } from 'lucide-react';
import { useOfflineStorage } from '@/lib/hooks/useOfflineStorage';

const MAX_STORAGE = 50 * 1024 * 1024; // 50MB limit

export function StorageInfo() {
  const { storageSize, clearOldData } = useOfflineStorage();
  const [usagePercent, setUsagePercent] = useState(0);

  useEffect(() => {
    setUsagePercent((storageSize / MAX_STORAGE) * 100);
  }, [storageSize]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Database className="h-4 w-4" />
          Offline Storage
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => clearOldData()}
          title="Clear old data"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Storage Used</span>
          <span>{formatSize(storageSize)} / {formatSize(MAX_STORAGE)}</span>
        </div>
        <Progress value={usagePercent} />
      </div>

      <div className="text-xs text-muted-foreground">
        Offline data older than 7 days will be automatically cleared
      </div>
    </Card>
  );
}