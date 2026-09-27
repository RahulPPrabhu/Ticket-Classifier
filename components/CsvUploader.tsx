'use client';

import React, { useState } from 'react';
import { DropZone } from './DropZone';
import { SummaryStats, ClassificationStats } from './SummaryStats';
import { DataPreviewTable } from './DataPreviewTable';
import { parseCSVString, CSVAnalysis } from '@/lib/csvUtils';
import {
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const CsvUploader: React.FC = () => {
  const [analysis, setAnalysis] = useState<CSVAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationStats, setClassificationStats] = useState<ClassificationStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    setError(null);
    setClassificationStats(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseCSVString(text, file.name, file.size);

        if (result.headers.length === 0) {
          setError('The uploaded CSV file is empty or missing headers.');
          setAnalysis(null);
        } else {
          setAnalysis(result);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file from disk.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleChooseOurDataset = async () => {
    setIsLoading(true);
    setError(null);
    setClassificationStats(null);

    try {
      const response = await fetch('/support-ticket-classification.csv');
      if (!response.ok) {
        throw new Error('Failed to load support-ticket-classification.csv');
      }
      const text = await response.text();
      const result = parseCSVString(text, 'support-ticket-classification.csv');

      if (result.headers.length === 0) {
        throw new Error('The dataset is empty.');
      }

      setAnalysis(result);
    } catch (err: unknown) {
      console.error('Error loading dataset:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyseTickets = async () => {
    if (!analysis || analysis.data.length === 0) return;

    setIsClassifying(true);
    setError(null);

    try {
      const textCol =
        analysis.headers.find((h) => h.trim().toLowerCase() === 'text') ||
        analysis.headers.find((h) =>
          ['issue', 'ticket', 'description', 'message', 'body', 'content'].includes(h.trim().toLowerCase())
        ) ||
        analysis.headers[0];

      const issues = analysis.data.map((row) => String(row[textCol] ?? ''));

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issues }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to classify tickets');
      }

      setClassificationStats({
        totalTimeMs: result.totalTimeMs,
        totalTickets: result.totalTickets,
        categoryCounts: result.categoryCounts,
      });

      const updatedData = analysis.data.map((row, idx) => ({
        ...row,
        category: result.results?.[idx]?.category || 'unclassified',
      }));

      const updatedHeaders = analysis.headers.includes('category')
        ? analysis.headers
        : ['category', ...analysis.headers.filter((h) => h !== 'category')];

      setAnalysis({
        ...analysis,
        headers: updatedHeaders,
        data: updatedData,
        columnTypes: {
          ...analysis.columnTypes,
          category: 'string',
        },
      });
    } catch (err: unknown) {
      console.error('Classification error:', err);
      setError(err instanceof Error ? err.message : 'Error classifying tickets.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setClassificationStats(null);
    setError(null);
    setIsClassifying(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white pb-20">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[128px] pointer-events-none" />

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Jev Ticket Classifier
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                Instant ticket classification
              </p>
            </div>
          </div>

          {analysis && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyseTickets}
                disabled={isClassifying}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-xs transition-all hover:scale-[1.02]"
              >
                {isClassifying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analysing Tickets...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Analyse Tickets
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                title="Upload New CSV"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Upload New CSV
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {!analysis ? (
          <div className="max-w-4xl mx-auto space-y-8 pt-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-indigo-700 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Instant ticket classification • 100% Fast & Accurate
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Upload & Analyze Support Tickets
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mx-auto">
                Upload a CSV of your support tickets and we'll automatically classify them and provide you with insights.
              </p>
            </div>

            <DropZone
              onFileUpload={handleFileUpload}
              onChooseDataset={handleChooseOurDataset}
              isLoading={isLoading}
              error={error}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between text-sm">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-xs font-medium underline hover:text-rose-900"
                >
                  Dismiss
                </button>
              </div>
            )}

            <SummaryStats
              analysis={analysis}
              classificationStats={classificationStats}
              isClassifying={isClassifying}
              onAnalyse={handleAnalyseTickets}
            />

            <DataPreviewTable analysis={analysis} />
          </div>
        )}
      </main>
    </div>
  );
};
