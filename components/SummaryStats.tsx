'use client';

import React from 'react';
import { CSVAnalysis } from '@/lib/csvUtils';
import {
  Clock,
  Zap,
  CheckCircle2,
  Tag,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Bug,
  Truck,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export interface ClassificationStats {
  totalTimeMs: number;
  totalTickets: number;
  categoryCounts: Record<string, number>;
}

interface SummaryStatsProps {
  analysis: CSVAnalysis;
  classificationStats?: ClassificationStats | null;
  isClassifying?: boolean;
  onAnalyse?: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  account_access: {
    label: 'Account Access',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: ShieldCheck,
  },
  billing: {
    label: 'Billing',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CreditCard,
  },
  refund_request: {
    label: 'Refund Request',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: RotateCcw,
  },
  bug_report: {
    label: 'Bug Report',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: Bug,
  },
  shipping_delivery: {
    label: 'Shipping & Delivery',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    icon: Truck,
  },
};

const getCategoryMeta = (cat: string) => {
  return (
    CATEGORY_CONFIG[cat] || {
      label: cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: HelpCircle,
    }
  );
};

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  analysis,
  classificationStats,
  isClassifying,
  onAnalyse,
}) => {
  const { totalRows } = analysis;

  if (classificationStats) {
    const { totalTimeMs, totalTickets, categoryCounts } = classificationStats;
    const timeFormatted =
      totalTimeMs >= 1000
        ? `${(totalTimeMs / 1000).toFixed(2)}s`
        : `${totalTimeMs}ms`;

    const sortedCategories = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    );

    return (
      <div className="space-y-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Time Taken
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {timeFormatted}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  total duration
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                Processed
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Total Classified
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {totalTickets.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  of {totalRows.toLocaleString()} tickets
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                100% classification completion
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <Tag className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-600" /> Unique Categories
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {sortedCategories.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  labels mapped
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                AI choice taxonomy applied
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" /> Category Counts Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Sorted by frequency
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {sortedCategories.map(([cat, count]) => {
              const meta = getCategoryMeta(cat);
              const Icon = meta.icon;
              const percentage = totalTickets > 0 ? ((count / totalTickets) * 100).toFixed(1) : '0';

              return (
                <div
                  key={cat}
                  className={`p-3.5 rounded-xl border ${meta.bg} ${meta.border} flex flex-col justify-between space-y-2 transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${meta.text}`} />
                    <span className={`text-[11px] font-semibold ${meta.text}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {count.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-600 truncate mt-0.5" title={meta.label}>
                      {meta.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (isClassifying) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-50 text-indigo-600 animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">
            Classifying Tickets
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Dispatching requests to the classification engine. This will take just a few seconds.
          </p>
        </div>
        <div className="w-full max-w-sm mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tickets Ready for Analysis
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {totalRows.toLocaleString()} tickets loaded
          </span>
        </div>
        <p className="text-sm font-medium text-slate-800">
          Click <strong className="text-indigo-600">"Analyse Tickets"</strong> to classify all issues and view time & category statistics.
        </p>
      </div>

      {onAnalyse && (
        <button
          onClick={onAnalyse}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Analyse Tickets
        </button>
      )}
    </div>
  );
};
