'use client';

import { ResponsiveContainer, VennDiagram } from 'recharts';

export function CoverageOverlap() {
  const data = [
    { value: 100, sets: ['A'] },
    { value: 80, sets: ['B'] },
    { value: 60, sets: ['A', 'B'] },
  ];

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <VennDiagram data={data} />
      </ResponsiveContainer>
    </div>
  );
}