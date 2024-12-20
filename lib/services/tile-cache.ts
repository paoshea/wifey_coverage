import localforage from 'localforage';
import { CompressionService } from './compression';
import * as idbKeyval from 'idb-keyval';

const TILE_CACHE = 'map-tiles-cache';
const TILE_CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB

class TileCache {
  private store: LocalForage;
  private metaStore: {
    get: typeof idbKeyval.get;
    set: typeof idbKeyval.set;
    del: typeof idbKeyval.del;
  };

  constructor() {
    this.store = localforage.createInstance({
      name: TILE_CACHE,
      storeName: 'tiles'
    });
    this.metaStore = {
      get: idbKeyval.get,
      set: idbKeyval.set,
      del: idbKeyval.del
    };
    this.initializeCache();
  }

  private async initializeCache() {
    try {
      const size = await this.metaStore.get('cache-size') || 0;
      const lastCleanup = await this.metaStore.get('last-cleanup') || 0;

      if (Date.now() - lastCleanup > 24 * 60 * 60 * 1000) {
        await this.clearExpired();
      }
    } catch (error) {
      console.error('Cache initialization error:', error);
    }
  }

  async getTile(url: string): Promise<Blob | null> {
    try {
      const cached = await this.store.getItem<{ data: string; timestamp: number }>(url);
      if (!cached) return null;

      if (Date.now() - cached.timestamp > TILE_CACHE_EXPIRY) {
        await this.store.removeItem(url);
        return null;
      }

      return CompressionService.decompressToBlob(cached.data);
    } catch (error) {
      console.error('Error retrieving cached tile:', error);
      return null;
    }
  }

  async setTile(url: string, data: Blob): Promise<void> {
    try {
      const compressed = await CompressionService.compressBlob(data);
      
      const currentSize = await this.getCacheSize();
      if (currentSize + compressed.length > MAX_CACHE_SIZE) {
        await this.clearOldest();
      }

      await this.store.setItem(url, {
        data: compressed,
        timestamp: Date.now()
      });

      await this.metaStore.set('cache-size', currentSize + compressed.length);
    } catch (error) {
      console.error('Error caching tile:', error);
    }
  }

  private async getCacheSize(): Promise<number> {
    return await this.metaStore.get('cache-size') || 0;
  }

  private async clearOldest(): Promise<void> {
    const items: { key: string; timestamp: number }[] = [];
    await this.store.iterate<{ data: string; timestamp: number }, void>((value, key) => {
      items.push({ key: key as string, timestamp: value.timestamp });
    });

    items.sort((a, b) => a.timestamp - b.timestamp);
    
    let currentSize = await this.metaStore.get('cache-size') || 0;
    const itemsToRemove = Math.ceil(items.length * 0.2);
    for (let i = 0; i < itemsToRemove; i++) {
      const item = await this.store.getItem<{ data: string; timestamp: number }>(items[i].key);
      if (item) {
        currentSize -= item.data.length;
      }
      await this.store.removeItem(items[i].key);
    }

    await this.metaStore.set('cache-size', currentSize);
  }

  async clearExpired(): Promise<void> {
    const now = Date.now();
    let newSize = 0;

    await this.store.iterate<{ data: string; timestamp: number }, void>(async (value, key) => {
      if (now - value.timestamp > TILE_CACHE_EXPIRY) {
        await this.store.removeItem(key);
      } else {
        newSize += value.data.length;
      }
    });

    await this.metaStore.set('cache-size', newSize);
    await this.metaStore.set('last-cleanup', now);
  }

  async getStats(): Promise<{
    size: number;
    count: number;
    lastCleanup: number;
  }> {
    const size = await this.getCacheSize();
    let count = 0;
    await this.store.iterate<{ data: string; timestamp: number }, void>(() => { count++; });
    const lastCleanup = await this.metaStore.get('last-cleanup') || 0;

    return { size, count, lastCleanup };
  }
}

export const tileCache = new TileCache();