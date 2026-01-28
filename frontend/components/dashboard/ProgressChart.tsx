'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { colors } from '@/design-system/colors';

interface ProgressChartProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  type?: 'line' | 'bar';
  dataKey?: string[];
  color?: string;
  title?: string;
}

export function ProgressChart({ data, type = 'line', dataKey = ['value'], color = colors.primary[500], title }: ProgressChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
      {title && <h3 className="text-lg font-semibold text-text-900 mb-4">{title}</h3>}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.background[300]} />
            <XAxis
              dataKey="name"
              stroke={colors.text[400]}
              fontSize={12}
            />
            <YAxis
              stroke={colors.text[400]}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: `1px solid ${colors.background[300]}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            {type === 'line' ? (
              dataKey.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              dataKey.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              ))
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
