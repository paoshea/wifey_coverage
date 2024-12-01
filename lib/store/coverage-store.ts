import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NetworkStatus, CoveragePoint } from '@/lib/types/network';

interface CoverageStore {
  coveragePoints: CoveragePoint[];
  offlinePoints: CoveragePoint[];
  addCoveragePoint: (point: CoveragePoint) => void;
  addOfflinePoint: (point: CoveragePoint) => void;
  syncOfflinePoints: () => Promise<void>;
}

export const useCoverageStore = create<CoverageStore>()(
  persist(
    (set, get) => ({
      coveragePoints: [],
      offlinePoints: [],
      addCoveragePoint: (point) => {
        set((state) => ({
          coveragePoints: [...state.coveragePoints, point]
        }));
      },
      addOfflinePoint: (point) => {
        set((state) => ({
          offlinePoints: [...state.offlinePoints, point]
        }));
      },
      syncOfflinePoints: async () => {
        const { offlinePoints } = get();
        if (navigator.onLine && offlinePoints.length > 0) {
          // Implement API sync logic here
          set({ offlinePoints: [] });
        }
      }
    }),
    {
      name: 'coverage-store'
    }
  )
);