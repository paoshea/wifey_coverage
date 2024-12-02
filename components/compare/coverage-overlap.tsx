'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors
);

export function CoverageOverlap() {
  const data = {
    labels: ['Unique Coverage', 'Overlapping Coverage', 'No Coverage'],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: [
          'hsl(var(--primary) / 0.8)',
          'hsl(var(--primary) / 0.5)',
          'hsl(var(--muted))'
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--primary))',
          'hsl(var(--muted-foreground))'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Coverage Distribution</h2>
      <div className="h-[300px] w-full">
        <Pie data={data} options={options} />
      </div>
    </Card>
  );
}