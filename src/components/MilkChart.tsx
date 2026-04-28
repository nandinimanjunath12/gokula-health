import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MilkRecord } from '../types';

interface Props {
  records: MilkRecord[];
}

export default function MilkChart({ records }: Props) {
  const data = records.map(r => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    total: r.morningYield + r.eveningYield,
    morning: r.morningYield,
    evening: r.eveningYield,
  })).slice(-14); // Last 14 days

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-300 italic text-sm">
        Add yield records to see trend
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2d5a27" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#2d5a27" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#9ca3af' }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '16px', 
            border: 'none', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#2d5a27" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTotal)" 
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
