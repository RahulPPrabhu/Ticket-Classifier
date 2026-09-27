'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface DropZoneProps {
  onFileUpload: (file: File) => void;
  onChooseDataset?: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileUpload,
  onChooseDataset,
  isLoading,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      alert('Please select a valid .csv file');
      return;
    }
    onFileUpload(file);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging
            ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01] shadow-xl shadow-indigo-500/10'
            : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/20'
          } p-8 sm:p-12 text-center`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,text/csv"
          className="hidden"
        />

        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-500" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/10 transition-all duration-500" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-all duration-300 shadow-sm">
            <UploadCloud className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
              Drag & Drop your CSV file here
            </h3>
            <p className="text-sm text-slate-500">
              or <span className="text-indigo-600 font-semibold underline underline-offset-4">click to browse</span> from your device
            </p>
          </div>

          {onChooseDataset && (
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChooseDataset();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-indigo-700 shadow-xs transition-all hover:scale-105"
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                or choose our dataset
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 pt-2 text-indigo-600 text-sm font-medium">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              Loading & Parsing CSV file...
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
