'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function QualityMetrics() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Quality Score'
        }
      }
    }
  };

  const labels = ['Signal Strength', 'Speed', 'Latency', 'Reliability'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Network A',
        data: [85, 75, 90, 80],
        backgroundColor: 'hsl(var(--primary) / 0.8)',
        stack: 'Stack 0',
      },
      {
        label: 'Network B',
        data: [70, 85, 75, 90],
        backgroundColor: 'hsl(var(--primary) / 0.5)',
        stack: 'Stack 1',
      },
    ],
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Network Quality Comparison</h2>
      <div className="h-[400px] w-full">
        <Bar options={options} data={data} />
      </div>
    </Card>
  );
}