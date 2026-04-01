import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

const propertyId = process.env.GA4_PROPERTY_ID!;

function getClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    return new BetaAnalyticsDataClient({ credentials });
  }
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) throw new Error("No GA4 credentials configured");
  const resolvedPath = keyPath.startsWith("./")
    ? path.join(process.cwd(), keyPath)
    : keyPath;
  return new BetaAnalyticsDataClient({ keyFilename: resolvedPath });
}

export async function getOverview(startDate: string, endDate: string) {
  const client = getClient();
  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      { startDate, endDate },
      { startDate: getPreviousPeriodStart(startDate, endDate), endDate: getPreviousPeriodEnd(startDate, endDate) },
    ],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "bounceRate" },
    ],
  });
  const response = res[0];
  const current = response.rows?.[0]?.metricValues;
  const previous = response.rows?.[1]?.metricValues;
  return {
    users:      { value: parseInt(current?.[0]?.value || "0"),  prev: parseInt(previous?.[0]?.value || "0") },
    sessions:   { value: parseInt(current?.[1]?.value || "0"),  prev: parseInt(previous?.[1]?.value || "0") },
    pageViews:  { value: parseInt(current?.[2]?.value || "0"),  prev: parseInt(previous?.[2]?.value || "0") },
    bounceRate: { value: parseFloat(current?.[3]?.value || "0"), prev: parseFloat(previous?.[3]?.value || "0") },
  };
}

export async function getRealtime() {
  const client = getClient();
  const res = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: "activeUsers" }],
  });
  const response = res[0];
  return {
    activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0"),
  };
}

export async function getTrend(startDate: string, endDate: string) {
  const client = getClient();
  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });
  const response = res[0];
  return (response.rows || []).map((row) => ({
    date: formatDate(row.dimensionValues?.[0]?.value || ""),
    sessions: parseInt(row.metricValues?.[0]?.value || "0"),
    users: parseInt(row.metricValues?.[1]?.value || "0"),
  }));
}

export async function getSources(startDate: string, endDate: string) {
  const client = getClient();
  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });
  const response = res[0];
  return (response.rows || []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || "Other",
    sessions: parseInt(row.metricValues?.[0]?.value || "0"),
  }));
}

export async function getTopPages(startDate: string, endDate: string) {
  const client = getClient();
  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });
  const response = res[0];
  return (response.rows || []).map((row) => ({
    title: row.dimensionValues?.[0]?.value || "",
    path: row.dimensionValues?.[1]?.value || "/",
    pageViews: parseInt(row.metricValues?.[0]?.value || "0"),
    avgDuration: parseFloat(row.metricValues?.[1]?.value || "0"),
    bounceRate: parseFloat(row.metricValues?.[2]?.value || "0"),
  }));
}

export async function getDevices(startDate: string, endDate: string) {
  const client = getClient();
  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  const response = res[0];
  return (response.rows || []).map((row) => ({
    device: row.dimensionValues?.[0]?.value || "other",
    sessions: parseInt(row.metricValues?.[0]?.value || "0"),
  }));
}

export async function getFunnel(startDate: string, endDate: string) {
  const client = getClient();
  const steps = [
    { key: "session_start",   label: "進入網站" },
    { key: "view_item",       label: "查看商品" },
    { key: "add_to_cart",     label: "加入購物車" },
    { key: "begin_checkout",  label: "開始結帳" },
    { key: "purchase",        label: "完成購買" },
  ];

  const res = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "eventName" }],
    metrics: [
      { name: "eventCount" },
      { name: "userEngagementDuration" },
      { name: "bounceRate" },
      { name: "sessions" },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: steps.map((s) => s.key) },
      },
    },
  });
  const eventsRes = res[0];

  const map: Record<string, { eventCount: number; duration: number; bounceRate: number; sessions: number }> = {};
  for (const row of eventsRes.rows || []) {
    const name = row.dimensionValues?.[0]?.value || "";
    map[name] = {
      eventCount: parseInt(row.metricValues?.[0]?.value || "0"),
      duration: parseFloat(row.metricValues?.[1]?.value || "0"),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || "0"),
      sessions: parseInt(row.metricValues?.[3]?.value || "0"),
    };
  }

  const funnelSteps = steps.map((step) => ({
    key: step.key,
    label: step.label,
    count: map[step.key]?.eventCount ?? 0,
    sessions: map[step.key]?.sessions ?? 0,
    avgDurationSec:
      (map[step.key]?.sessions ?? 0) > 0
        ? Math.round(map[step.key].duration / map[step.key].sessions)
        : 0,
    bounceRate: map[step.key]?.bounceRate ?? 0,
  }));

  return funnelSteps.map((step, i) => {
    const prev = i > 0 ? funnelSteps[i - 1].count : step.count;
    const dropOffRate = prev > 0 ? ((prev - step.count) / prev) * 100 : 0;
    const conversionRate = i > 0 && prev > 0 ? (step.count / prev) * 100 : 100;
    return { ...step, dropOffRate, conversionRate };
  });
}

// Helpers
function resolveDate(dateStr: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateStr === "today") return today;
  if (dateStr === "yesterday") return new Date(today.getTime() - 86400000);
  const m = dateStr.match(/^(\d+)daysAgo$/);
  if (m) return new Date(today.getTime() - parseInt(m[1]) * 86400000);
  return new Date(dateStr);
}

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getPreviousPeriodStart(startDate: string, endDate: string): string {
  const start = resolveDate(startDate);
  const end = resolveDate(endDate);
  const diff = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 86400000);
  const prevStart = new Date(prevEnd.getTime() - diff);
  return toISODate(prevStart);
}

function getPreviousPeriodEnd(startDate: string, endDate: string): string {
  const start = resolveDate(startDate);
  const prevEnd = new Date(start.getTime() - 86400000);
  return toISODate(prevEnd);
}

function formatDate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}
