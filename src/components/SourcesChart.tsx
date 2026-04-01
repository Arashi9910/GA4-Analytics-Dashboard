"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

type SourceData = { source: string; sessions: number };
type Props = { data: SourceData[]; loading?: boolean };

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-gray-300">{payload[0].value.toLocaleString()} 工作階段</p>
      </div>
    );
  }
  return null;
};

export default function SourcesChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-32 mb-6" />
        <div className="h-48 bg-gray-800 rounded-full mx-auto w-48" />
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.sessions, 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-6">流量來源</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="sessions"
            nameKey="source"
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {data.map((item, i) => (
          <div key={item.source} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-gray-400">{item.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">{item.sessions.toLocaleString()}</span>
              <span className="text-gray-600 w-10 text-right">
                {total > 0 ? ((item.sessions / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
