'use client';

import React, { useState, useMemo } from 'react';
import { CSVAnalysis } from '@/lib/csvUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPreviewTableProps {
  analysis: CSVAnalysis;
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({ analysis }) => {
  const { headers, data, columnTypes } = analysis;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold tracking-wider sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                {headers.map((header) => {
                  const type = columnTypes[header] || 'string';
                  return (
                    <th key={header} className="py-3 px-4 select-none">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-semibold">
                          {header}
                        </span>
                        <span className="text-[9px] lowercase font-normal px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                          {type}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => {
                  const actualIndex = (currentPage - 1) * pageSize + rowIndex + 1;
                  return (
                    <tr
                      key={rowIndex}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-4 text-center text-xs font-mono text-slate-400">
                        {actualIndex}
                      </td>
                      {headers.map((header) => {
                        const val = row[header];
                        const isNull = val === null || val === undefined || val === '';
                        return (
                          <td key={header} className="py-2.5 px-4 whitespace-nowrap text-xs">
                            {isNull ? (
                              <span className="italic text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                null
                              </span>
                            ) : header.toLowerCase() === 'category' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block">
                                {String(val)}
                              </span>
                            ) : typeof val === 'number' ? (
                              <span className="font-mono font-medium text-indigo-600">
                                {val.toLocaleString()}
                              </span>
                            ) : typeof val === 'boolean' ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${val ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                {String(val)}
                              </span>
                            ) : (
                              <span className="text-slate-800">{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={headers.length + 1}
                    className="py-12 text-center text-slate-500"
                  >
                    No records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>
              Showing{' '}
              <strong className="text-slate-900 font-semibold">
                {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900 font-semibold">
                {Math.min(currentPage * pageSize, data.length)}
              </strong>{' '}
              of <strong className="text-slate-900 font-semibold">{data.length}</strong> entries
            </span>

            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-700 rounded px-2 py-1 focus:outline-none shadow-2xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
