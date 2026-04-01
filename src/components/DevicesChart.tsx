"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS: Record<string, string> = {
  mobile: "#6366f1",
  desktop: "#10b981",
  tablet: "#f59e0b",
};

type DeviceData = { device: string; sessions: number };
type Props = { data: DeviceData[]; loading?: boolean };

const LABEL: Record<string, string> = {
  mobile: "手機",
  desktop: "桌機",
  tablet: "平板",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-white font-medium">{LABEL[payload[0].payload.device] || payload[0].payload.device}</p>
        <p className="text-gray-300">{payload[0].value.toLocaleString()} 工作階段</p>
      </div>
    );
  }
  return null;
};

export default function DevicesChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-32 mb-6" />
        <div className="h-48 bg-gray-800 rounded" />
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.sessions, 0);
  const displayData = data.map((d) => ({
    ...d,
    label: LABEL[d.device] || d.device,
    pct: total > 0 ? ((d.sessions / total) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-6">裝置分佈</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={displayData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
            {displayData.map((d, i) => (
              <Cell key={i} fill={COLORS[d.device] || "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-4">
        {displayData.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-xs text-gray-500">{d.label}</p>
            <p className="text-lg font-bold text-white">{d.pct}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
