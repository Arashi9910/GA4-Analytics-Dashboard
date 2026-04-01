"use client";

import { useState } from "react";

export type DateRange = {
  startDate: string;
  endDate: string;
  label: string;
};

const PRESETS: DateRange[] = [
  { label: "今天", startDate: "today", endDate: "today" },
  { label: "昨天", startDate: "yesterday", endDate: "yesterday" },
  { label: "過去 7 天", startDate: "7daysAgo", endDate: "today" },
  { label: "過去 30 天", startDate: "30daysAgo", endDate: "today" },
  { label: "過去 90 天", startDate: "90daysAgo", endDate: "today" },
];

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handlePreset = (preset: DateRange) => {
    onChange(preset);
    setShowCustom(false);
    setOpen(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange({ label: `${customStart} ~ ${customEnd}`, startDate: customStart, endDate: customEnd });
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 hover:bg-gray-700 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {value.label}
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  value.label === preset.label
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                showCustom ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              自訂範圍
            </button>
          </div>

          {showCustom && (
            <div className="border-t border-gray-700 p-3 space-y-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">開始日期</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">結束日期</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleCustomApply}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                套用
              </button>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
