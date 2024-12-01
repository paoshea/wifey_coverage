'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    metric: 'Coverage',
    'Provider A': 85,
    'Provider B': 78,
  },
  {
    metric: 'Speed',
    'Provider A': 90,
    'Provider B': 75,
  },
  {
    metric: 'Reliability',
    'Provider A': 95,
    'Provider B': 88,
  },
  {
    metric: 'Value',
    'Provider A': 80,
    'Provider B': 85,
  },
  {
    metric: 'Support',
    'Provider A': 75,
    'Provider B': 80,
  },
];

export function QualityMetrics() {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Provider A"
            dataKey="Provider A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
          <Radar
            name="Provider B"
            dataKey="Provider B"
            stroke="hsl(var(--secondary))"
            fill="hsl(var(--secondary))"
            fillOpacity={0.2}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}