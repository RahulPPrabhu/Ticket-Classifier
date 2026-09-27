'use client';

import React from 'react';
import { CSVAnalysis } from '@/lib/csvUtils';
import { Hash, Type, Calendar, ToggleLeft, Layers, PieChart } from 'lucide-react';

interface ColumnAnalysisProps {
  analysis: CSVAnalysis;
}

export const ColumnAnalysis: React.FC<ColumnAnalysisProps> = ({ analysis }) => {
  const { headers, data, columnTypes, totalRows } = analysis;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {headers.map((header) => {
        const type = columnTypes[header] || 'string';
        const values = data.map((row) => row[header]).filter((v) => v !== null && v !== undefined && v !== '');
        const uniqueValues = Array.from(new Set(values));
        const missingCount = totalRows - values.length;
        const missingPct = ((missingCount / totalRows) * 100).toFixed(1);

        let minVal: number | null = null;
        let maxVal: number | null = null;
        let avgVal: number | null = null;

        if (type === 'number') {
          const numValues = values.filter((v): v is number => typeof v === 'number');
          if (numValues.length > 0) {
            minVal = Math.min(...numValues);
            maxVal = Math.max(...numValues);
            avgVal = numValues.reduce((a, b) => a + b, 0) / numValues.length;
          }
        }

        const sampleValues = uniqueValues.slice(0, 4);

        return (
          <div
            key={header}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900 text-base truncate max-w-[180px]" title={header}>
                  {header}
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  {type === 'number' && <Hash className="w-3.5 h-3.5 text-blue-600" />}
                  {type === 'string' && <Type className="w-3.5 h-3.5 text-emerald-600" />}
                  {type === 'date' && <Calendar className="w-3.5 h-3.5 text-amber-600" />}
                  {type === 'boolean' && <ToggleLeft className="w-3.5 h-3.5 text-purple-600" />}
                  <span className="text-xs capitalize text-slate-500 font-medium">
                    {type} Column
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">
                  {uniqueValues.length} unique
                </span>
                {missingCount > 0 && (
                  <span className="text-rose-600 font-medium mt-1">
                    {missingCount} missing ({missingPct}%)
                  </span>
                )}
              </div>
            </div>

            {type === 'number' && minVal !== null && maxVal !== null && avgVal !== null ? (
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Min</div>
                  <div className="text-xs font-mono font-semibold text-slate-800">{minVal.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Avg</div>
                  <div className="text-xs font-mono font-semibold text-indigo-600">{avgVal.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Max</div>
                  <div className="text-xs font-mono font-semibold text-slate-800">{maxVal.toLocaleString()}</div>
                </div>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" /> Distinct Examples:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleValues.map((val, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 max-w-[140px] truncate"
                    title={String(val)}
                  >
                    {String(val)}
                  </span>
                ))}
                {uniqueValues.length > 4 && (
                  <span className="text-[11px] text-slate-400 flex items-center">
                    +{uniqueValues.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Data Completeness</span>
                <span>{(((totalRows - missingCount) / totalRows) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${((totalRows - missingCount) / totalRows) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
