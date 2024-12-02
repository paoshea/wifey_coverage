'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

export function CoverageOverlap() {
  const data = [
    { name: 'Network A Only', value: 40 },
    { name: 'Network B Only', value: 20 },
    { name: 'Overlap', value: 60 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}