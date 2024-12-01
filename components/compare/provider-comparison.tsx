'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const providers = [
  {
    name: 'Provider A',
    coverage: '85%',
    avgSpeed: '120 Mbps',
    reliability: '98%',
    price: '$60/mo',
  },
  {
    name: 'Provider B',
    coverage: '78%',
    avgSpeed: '95 Mbps',
    reliability: '96%',
    price: '$50/mo',
  },
  // Add more providers as needed
];

export function ProviderComparison() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provider</TableHead>
          <TableHead>Coverage</TableHead>
          <TableHead>Avg Speed</TableHead>
          <TableHead>Reliability</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => (
          <TableRow key={provider.name}>
            <TableCell className="font-medium">{provider.name}</TableCell>
            <TableCell>{provider.coverage}</TableCell>
            <TableCell>{provider.avgSpeed}</TableCell>
            <TableCell>{provider.reliability}</TableCell>
            <TableCell>{provider.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}