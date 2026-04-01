"use client";

import { useState } from "react";

type PageData = {
  title: string;
  path: string;
  pageViews: number;
  avgDuration: number;
  bounceRate: number;
};

type SortKey = keyof Omit<PageData, "path">;

type Props = { data: PageData[]; loading?: boolean };

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TopPagesTable({ data, loading }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("pageViews");
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc(!sortDesc);
    else { setSortKey(key); setSortDesc(true); }
  };

  const sorted = [...data].sort((a, b) =>
    sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
  );

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 text-gray-600">
      {sortKey === k ? (sortDesc ? "↓" : "↑") : "↕"}
    </span>
  );

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-32 mb-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-800 rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-base font-semibold text-gray-200 mb-4">熱門頁面</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-2 text-gray-500 font-medium">頁面路徑</th>
              <th
                className="text-right py-3 px-2 text-gray-500 font-medium cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("pageViews")}
              >
                瀏覽數 <SortIcon k="pageViews" />
              </th>
              <th
                className="text-right py-3 px-2 text-gray-500 font-medium cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("avgDuration")}
              >
                平均停留 <SortIcon k="avgDuration" />
              </th>
              <th
                className="text-right py-3 px-2 text-gray-500 font-medium cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("bounceRate")}
              >
                跳出率 <SortIcon k="bounceRate" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3 px-2 max-w-xs">
                  <p className="text-gray-200 text-sm truncate" title={row.path}>
                    {row.title || row.path}
                  </p>
                  <p className="text-gray-600 text-xs truncate font-mono">{row.path}</p>
                </td>
                <td className="py-3 px-2 text-right text-white font-medium">
                  {row.pageViews.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-300">
                  {formatDuration(row.avgDuration)}
                </td>
                <td className="py-3 px-2 text-right">
                  <span
                    className={`font-medium ${
                      row.bounceRate > 0.6 ? "text-red-400" : row.bounceRate > 0.4 ? "text-yellow-400" : "text-emerald-400"
                    }`}
                  >
                    {(row.bounceRate * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
