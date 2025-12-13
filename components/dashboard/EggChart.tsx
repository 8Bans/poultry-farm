'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  collected: number;
  sold: number;
  spoiled: number;
}

interface EggChartProps {
  batchId?: string;
  refreshKey?: number;
}

export default function EggChart({ batchId, refreshKey }: EggChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [batchId, refreshKey]);

  const fetchData = async () => {
    try {
      const url = batchId ? `/api/eggs/stats?batch=${batchId}` : '/api/eggs/stats';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch egg stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Egg Production (Last 6 Months)</CardTitle>
        <CardDescription>Monthly egg collection, sales, and spoilage</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#888888"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#888888"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="collected"
                stroke="#f97316"
                strokeWidth={2}
                name="Collected"
              />
              <Line
                type="monotone"
                dataKey="sold"
                stroke="#10b981"
                strokeWidth={2}
                name="Sold"
              />
              <Line
                type="monotone"
                dataKey="spoiled"
                stroke="#ef4444"
                strokeWidth={2}
                name="Spoiled"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
