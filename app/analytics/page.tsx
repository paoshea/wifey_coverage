'use client';

import { Card } from '@/components/ui/card';
import { useCoverageStore } from '@/lib/store/coverage-store';
import { formatDistanceToNow } from 'date-fns';
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

interface ChartData {
  time: string;
  value: number;
}

function NetworkChart({ 
  data,
  title, 
  unit 
}: { 
  data: ChartData[];
  title: string;
  unit: string;
}) {
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        fill: true,
        label: `${title} (${unit})`,
        data: data.map(d => d.value),
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
          text: unit
        }
      }
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-[300px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { coveragePoints } = useCoverageStore();
  const lastPoints = coveragePoints.slice(-20);

  const strengthData = lastPoints.map(point => ({
    time: formatDistanceToNow(new Date(point.timestamp), { addSuffix: true }),
    value: point.status.strength
  }));

  const speedData = lastPoints.map(point => ({
    time: formatDistanceToNow(new Date(point.timestamp), { addSuffix: true }),
    value: point.status.speed || 0
  }));

  const latencyData = lastPoints.map(point => ({
    time: formatDistanceToNow(new Date(point.timestamp), { addSuffix: true }),
    value: point.status.latency || 0
  }));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Network Analytics</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <NetworkChart 
          data={strengthData}
          title="Signal Strength"
          unit="%"
        />

        <NetworkChart 
          data={speedData}
          title="Network Speed"
          unit="Mbps"
        />

        <NetworkChart 
          data={latencyData}
          title="Network Latency"
          unit="ms"
        />

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Data Points</p>
              <p className="text-2xl font-bold">{coveragePoints.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Signal Strength</p>
              <p className="text-2xl font-bold">
                {coveragePoints.length > 0
                  ? Math.round(
                      coveragePoints.reduce((acc, point) => acc + point.status.strength, 0) /
                      coveragePoints.length
                    )
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Speed</p>
              <p className="text-2xl font-bold">
                {coveragePoints.length > 0
                  ? Math.round(
                      coveragePoints.reduce((acc, point) => acc + (point.status.speed || 0), 0) /
                      coveragePoints.length
                    )
                  : 0} Mbps
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Latency</p>
              <p className="text-2xl font-bold">
                {coveragePoints.length > 0
                  ? Math.round(
                      coveragePoints.reduce((acc, point) => acc + (point.status.latency || 0), 0) /
                      coveragePoints.length
                    )
                  : 0} ms
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
