"use client";

import { useEffect, useState } from "react";
import DateRangePicker, { DateRange } from "@/components/DateRangePicker";
import KpiCard from "@/components/KpiCard";
import RealtimeWidget from "@/components/RealtimeWidget";
import TrendChart from "@/components/TrendChart";
import SourcesChart from "@/components/SourcesChart";
import DevicesChart from "@/components/DevicesChart";
import TopPagesTable from "@/components/TopPagesTable";
import FunnelChart from "@/components/FunnelChart";

const DEFAULT_RANGE: DateRange = {
  label: "過去 7 天",
  startDate: "7daysAgo",
  endDate: "today",
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_RANGE);
  const [overview, setOverview] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async (range: DateRange) => {
    setLoading(true);
    setOverview(null);
    setTrend([]);
    setSources([]);
    setPages([]);
    setDevices([]);
    setFunnel([]);
    const qs = `startDate=${range.startDate}&endDate=${range.endDate}`;
    try {
      const [ovRes, trendRes, srcRes, pgRes, devRes, funnelRes] = await Promise.all([
        fetch(`/api/ga4/overview?${qs}`).then((r) => r.json()),
        fetch(`/api/ga4/trend?${qs}`).then((r) => r.json()),
        fetch(`/api/ga4/sources?${qs}`).then((r) => r.json()),
        fetch(`/api/ga4/pages?${qs}`).then((r) => r.json()),
        fetch(`/api/ga4/devices?${qs}`).then((r) => r.json()),
        fetch(`/api/ga4/funnel?${qs}`).then((r) => r.json()),
      ]);
      setOverview(ovRes);
      setTrend(Array.isArray(trendRes) ? trendRes : []);
      setSources(Array.isArray(srcRes) ? srcRes : []);
      setPages(Array.isArray(pgRes) ? pgRes : []);
      setDevices(Array.isArray(devRes) ? devRes : []);
      setFunnel(Array.isArray(funnelRes) ? funnelRes : []);
    } catch (err) {
      console.error("Failed to fetch GA4 data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(dateRange);
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Analytics Dashboard</h1>
              <p className="text-xs text-gray-500">GA4 · Property {process.env.NEXT_PUBLIC_PROPERTY_ID || "518462706"}</p>
            </div>
          </div>
          <DateRangePicker value={dateRange} onChange={(r) => setDateRange(r)} />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Realtime */}
        <RealtimeWidget />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="用戶數"
            value={overview?.users?.value ?? 0}
            prevValue={overview?.users?.prev}
            loading={loading}
          />
          <KpiCard
            title="工作階段"
            value={overview?.sessions?.value ?? 0}
            prevValue={overview?.sessions?.prev}
            loading={loading}
          />
          <KpiCard
            title="頁面瀏覽"
            value={overview?.pageViews?.value ?? 0}
            prevValue={overview?.pageViews?.prev}
            loading={loading}
          />
          <KpiCard
            title="跳出率"
            value={overview?.bounceRate?.value ?? 0}
            prevValue={overview?.bounceRate?.prev}
            format="percent"
            loading={loading}
          />
        </div>

        {/* Trend Chart */}
        <TrendChart data={trend} loading={loading} />

        {/* Sources + Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SourcesChart data={sources} loading={loading} />
          <DevicesChart data={devices} loading={loading} />
        </div>

        {/* Funnel */}
        <FunnelChart data={funnel} loading={loading} />

        {/* Top Pages */}
        <TopPagesTable data={pages} loading={loading} />
      </main>
    </div>
  );
}
