import localforage from 'localforage';
import { CompressionService } from './compression';

class StorageManager {
  private static instance: StorageManager;
  private stores: Map<string, LocalForage> = new Map();
  private readonly MAX_STORAGE = 50 * 1024 * 1024; // 50MB

  private constructor() {
    this.initializeStores();
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private initializeStores() {
    // Coverage data store
    this.stores.set('coverage', localforage.createInstance({
      name: 'coverage-store',
      storeName: 'coverage-data'
    }));

    // Map tiles store
    this.stores.set('tiles', localforage.createInstance({
      name: 'tiles-store',
      storeName: 'map-tiles'
    }));

    // GPS tracks store
    this.stores.set('tracks', localforage.createInstance({
      name: 'tracks-store',
      storeName: 'gps-tracks'
    }));
  }

  async store(storeName: string, key: string, data: any): Promise<void> {
    const store = this.stores.get(storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);

    const compressed = await CompressionService.compress(data);
    await store.setItem(key, compressed);
  }

  async retrieve(storeName: string, key: string): Promise<any> {
    const store = this.stores.get(storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);

    const compressed = await store.getItem<string>(key);
    if (!compressed) return null;

    return CompressionService.decompress(compressed);
  }

  async remove(storeName: string, key: string): Promise<void> {
    const store = this.stores.get(storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);

    await store.removeItem(key);
  }

  async clear(storeName: string): Promise<void> {
    const store = this.stores.get(storeName);
    if (!store) throw new Error(`Store ${storeName} not found`);

    await store.clear();
  }

  async getStorageInfo(): Promise<{
    usage: number;
    quota: number;
    stores: { [key: string]: number };
  }> {
    const storesSizes: { [key: string]: number } = {};
    let totalUsage = 0;

    for (const [name, store] of this.stores) {
      let storeSize = 0;
      await store.iterate((value) => {
        storeSize += new Blob([String(value)]).size;
      });
      storesSizes[name] = storeSize;
      totalUsage += storeSize;
    }

    return {
      usage: totalUsage,
      quota: this.MAX_STORAGE,
      stores: storesSizes
    };
  }

  async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();

    for (const store of this.stores.values()) {
      await store.iterate((value, key) => {
        try {
          const data = CompressionService.decompress(value);
          if (data.timestamp && now - data.timestamp > maxAge) {
            store.removeItem(key);
          }
        } catch (error) {
          console.error('Error processing stored item:', error);
        }
      });
    }
  }
}

export const storageManager = StorageManager.getInstance();