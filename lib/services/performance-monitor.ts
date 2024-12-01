class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupPerformanceObserver();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration);
        }
      });

      observer.observe({ entryTypes: ['measure'] });
    }
  }

  startMeasurement(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  endMeasurement(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  }

  private recordMetric(name: string, value: number): void {
    const metrics = this.metrics.get(name) || [];
    metrics.push(value);
    this.metrics.set(name, metrics);
  }

  getMetrics(name: string): { avg: number; min: number; max: number } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    return {
      avg: metrics.reduce((a, b) => a + b) / metrics.length,
      min: Math.min(...metrics),
      max: Math.max(...metrics)
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();