"use client";

import { useEffect, useState } from "react";

export default function RealtimeWidget() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRealtime = async () => {
    try {
      const res = await fetch("/api/ga4/realtime");
      const data = await res.json();
      setActiveUsers(data.activeUsers ?? 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-emerald-400 rounded-full pulse-dot" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400">即時在線用戶</p>
        {loading ? (
          <div className="h-8 bg-gray-800 rounded w-16 mt-1 animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-white">{activeUsers ?? "—"}</p>
        )}
      </div>
      <div className="ml-auto text-xs text-gray-600">每 30 秒更新</div>
    </div>
  );
}
