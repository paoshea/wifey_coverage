'use client';

import { StatsCard } from '@/components/profile/stats-card';
import { Card } from '@/components/ui/card';
import { CoverageChart } from '@/components/analytics/coverage-chart';

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          View your network coverage contributions and statistics
        </p>
      </div>

      <div className="space-y-6">
        <StatsCard />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Coverage History</h2>
          <CoverageChart />
        </Card>
      </div>
    </div>
  );
}