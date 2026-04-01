"use client";

type FunnelStep = {
  key: string;
  label: string;
  count: number;
  sessions: number;
  avgDurationSec: number;
  bounceRate: number;
  dropOffRate: number;
  conversionRate: number;
};

type Props = { data: FunnelStep[]; loading?: boolean };

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

const STEP_COLORS = [
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-purple-500 to-purple-600",
  "from-fuchsia-500 to-fuchsia-600",
  "from-pink-500 to-pink-600",
];

const BAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

export default function FunnelChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-32 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-xl" style={{ width: `${100 - i * 12}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-gray-200 mb-4">銷售漏斗</h3>
        <p className="text-gray-500 text-sm">尚無漏斗資料，請確認 GA4 有設定電商事件。</p>
      </div>
    );
  }

  const maxCount = data[0]?.count || 1;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-200">銷售漏斗</h3>
        {data[data.length - 1]?.count > 0 && data[0]?.count > 0 && (
          <div className="text-sm text-gray-400">
            整體轉換率：
            <span className="text-white font-semibold ml-1">
              {((data[data.length - 1].count / data[0].count) * 100).toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Funnel bars */}
      <div className="space-y-3 mb-8">
        {data.map((step, i) => {
          const widthPct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
          return (
            <div key={step.key}>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="relative flex items-center rounded-xl px-4 py-3 transition-all"
                  style={{
                    width: `${Math.max(widthPct, 20)}%`,
                    minWidth: "140px",
                    background: `linear-gradient(135deg, ${BAR_COLORS[i]}22, ${BAR_COLORS[i]}44)`,
                    borderLeft: `3px solid ${BAR_COLORS[i]}`,
                  }}
                >
                  <span className="text-sm font-medium text-white truncate">{step.label}</span>
                  <span className="ml-auto pl-3 text-white font-bold text-sm whitespace-nowrap">
                    {step.count.toLocaleString()}
                  </span>
                </div>
                {i > 0 && step.dropOffRate > 0 && (
                  <div className="text-xs text-red-400 flex items-center gap-1 whitespace-nowrap">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    放棄 {step.dropOffRate.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 px-2 text-gray-500 font-medium">步驟</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">事件數</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">平均停留</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">跳出率</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">上步轉換</th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">放棄率</th>
            </tr>
          </thead>
          <tbody>
            {data.map((step, i) => (
              <tr key={step.key} className="border-b border-gray-800/40 hover:bg-gray-800/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: BAR_COLORS[i] }}
                    />
                    <span className="text-gray-200">{step.label}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-white font-medium">
                  {step.count.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-300">
                  {step.avgDurationSec > 0 ? formatDuration(step.avgDurationSec) : "—"}
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={step.bounceRate > 0.6 ? "text-red-400" : step.bounceRate > 0.4 ? "text-yellow-400" : "text-emerald-400"}>
                    {step.bounceRate > 0 ? `${(step.bounceRate * 100).toFixed(1)}%` : "—"}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  {i === 0 ? (
                    <span className="text-gray-600">—</span>
                  ) : (
                    <span className="text-emerald-400 font-medium">
                      {step.conversionRate.toFixed(1)}%
                    </span>
                  )}
                </td>
                <td className="py-3 px-2 text-right">
                  {i === 0 ? (
                    <span className="text-gray-600">—</span>
                  ) : (
                    <span className={step.dropOffRate > 70 ? "text-red-400 font-medium" : step.dropOffRate > 40 ? "text-yellow-400" : "text-gray-400"}>
                      {step.dropOffRate.toFixed(1)}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
