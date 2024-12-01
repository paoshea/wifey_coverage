'use client';

import { CoverageForm } from '@/components/report/coverage-form';
import { Card } from '@/components/ui/card';

export default function ReportPage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold mb-6">Report Coverage Issues</h1>
      <Card className="p-6">
        <CoverageForm />
      </Card>
    </div>
  );
}