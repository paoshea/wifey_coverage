'use client';

import { Card } from '@/components/ui/card';
import { ProviderComparison } from '@/components/compare/provider-comparison';
import { CoverageOverlap } from '@/components/compare/coverage-overlap';
import { QualityMetrics } from '@/components/compare/quality-metrics';

export default function ComparePage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold mb-6">Compare Providers</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Provider Comparison</h2>
          <ProviderComparison />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Coverage Overlap</h2>
          <CoverageOverlap />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quality Metrics</h2>
          <QualityMetrics />
        </Card>
      </div>
    </div>
  );
}