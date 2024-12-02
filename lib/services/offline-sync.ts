import { NetworkStatus, CoveragePoint } from '@/lib/types/network';
import { CompressionService } from './compression';
import localforage from 'localforage';

const SYNC_QUEUE = 'sync-queue';
const MAX_RETRY_ATTEMPTS = 3;

interface SyncItem {
  id: string;
  data: CoveragePoint;
  attempts: number;
  timestamp: number;
}

class OfflineSync {
  private store: LocalForage;
  private syncInProgress = false;

  constructor() {
    this.store = localforage.createInstance({
      name: SYNC_QUEUE,
      storeName: 'pending'
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.syncPendingData());
    }
  }

  async addToQueue(point: CoveragePoint): Promise<void> {
    const item: SyncItem = {
      id: crypto.randomUUID(),
      data: point,
      attempts: 0,
      timestamp: Date.now()
    };

    const compressed = CompressionService.compress(item);
    await this.store.setItem(item.id, compressed);

    if (navigator.onLine) {
      await this.syncPendingData();
    }
  }

  public async syncPendingData(): Promise<void> {
    if (this.syncInProgress) return;

    try {
      this.syncInProgress = true;
      const items: SyncItem[] = [];

      await this.store.iterate<string, void>((compressed, key) => {
        const item = CompressionService.decompress(compressed) as SyncItem;
        items.push(item);
      });

      for (const item of items) {
        if (item.attempts >= MAX_RETRY_ATTEMPTS) {
          await this.store.removeItem(item.id);
          continue;
        }

        try {
          // Simulate API call to sync data
          await new Promise(resolve => setTimeout(resolve, 1000));
          await this.store.removeItem(item.id);
        } catch (error) {
          item.attempts++;
          await this.store.setItem(item.id, CompressionService.compress(item));
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  async getPendingCount(): Promise<number> {
    let count = 0;
    await this.store.iterate(() => { count++; });
    return count;
  }

  async clearQueue(): Promise<void> {
    await this.store.clear();
  }
}

export const offlineSync = new OfflineSync();