'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useCoverageStore } from '@/lib/store/coverage-store';

export function CoverageChart() {
  const { coveragePoints } = useCoverageStore();
  
  const chartData = useMemo(() => {
    return coveragePoints.map(point => ({
      time: new Date(point.createdAt).toLocaleTimeString(),
      strength: point.status.strength,
      type: point.status.type
    }));
  }, [coveragePoints]);

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="strength"
            stroke="hsl(var(--primary))"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}