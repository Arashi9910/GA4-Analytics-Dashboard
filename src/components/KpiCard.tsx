"use client";

type Props = {
  title: string;
  value: string | number;
  prevValue?: number;
  format?: "number" | "percent";
  loading?: boolean;
};

function calcChange(current: number, prev: number): number {
  if (prev === 0) return 0;
  return ((current - prev) / prev) * 100;
}

export default function KpiCard({ title, value, prevValue, format = "number", loading }: Props) {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  const change = prevValue !== undefined ? calcChange(numValue, prevValue) : null;
  const isPositive = change !== null && change >= 0;

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-24 mb-4" />
        <div className="h-8 bg-gray-800 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-20" />
      </div>
    );
  }

  const displayValue =
    format === "percent"
      ? `${(numValue * 100).toFixed(1)}%`
      : numValue.toLocaleString();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <p className="text-sm text-gray-400 mb-3">{title}</p>
      <p className="text-3xl font-bold text-white mb-2">{displayValue}</p>
      {change !== null && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{Math.abs(change).toFixed(1)}% 相較上期</span>
        </div>
      )}
    </div>
  );
}
