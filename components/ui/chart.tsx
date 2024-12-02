'use client';

import * as React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Chart({ className, children, ...props }: ChartProps) {
  return (
    <div
      className={cn(
        "flex aspect-video justify-center text-xs",
        className
      )}
      {...props}
    >
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}

interface ChartLineProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }[];
  };
  className?: string;
}

export function ChartLine({ data, className }: ChartLineProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={cn("h-full w-full", className)}>
      <Line data={data} options={options} />
    </div>
  );
}

interface ChartBarProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  className?: string;
}

export function ChartBar({ data, className }: ChartBarProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={cn("h-full w-full", className)}>
      <Bar data={data} options={options} />
    </div>
  );
}
