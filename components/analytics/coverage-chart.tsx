'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function CoverageChart() {
  const { coveragePoints } = useCoverageStore();
  const lastPoints = coveragePoints.slice(-20);

  const data = {
    labels: lastPoints.map(point => 
      formatDistanceToNow(new Date(point.createdAt), { addSuffix: true })
    ),
    datasets: [
      {
        fill: true,
        label: 'Signal Strength (%)',
        data: lastPoints.map(point => point.status.strength),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Signal Strength (%)'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Network Coverage</h2>
      <div className="h-[300px] w-full">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}