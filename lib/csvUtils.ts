import Papa from 'papaparse';

export interface CSVAnalysis {
  fileName: string;
  fileSize: number;
  totalRows: number;
  totalCols: number;
  headers: string[];
  data: Record<string, unknown>[];
  errors: Papa.ParseError[];
  columnTypes: Record<string, 'number' | 'boolean' | 'date' | 'string'>;
  missingValuesCount: number;
}

export function parseCSVString(csvString: string, fileName: string = 'data.csv', fileSize: number = 0): CSVAnalysis {
  const result = Papa.parse<Record<string, unknown>>(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields || [];
  const data = result.data || [];

  const columnTypes: Record<string, 'number' | 'boolean' | 'date' | 'string'> = {};
  let missingValuesCount = 0;

  headers.forEach((header) => {
    let numCount = 0;
    let boolCount = 0;
    let dateCount = 0;
    let strCount = 0;
    let validCount = 0;

    data.forEach((row) => {
      const val = row[header];
      if (val === null || val === undefined || val === '') {
        missingValuesCount++;
        return;
      }
      validCount++;

      if (typeof val === 'number') {
        numCount++;
      } else if (typeof val === 'boolean') {
        boolCount++;
      } else if (typeof val === 'string') {
        if (!isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.includes('.')) && val.length > 5) {
          dateCount++;
        } else {
          strCount++;
        }
      }
    });

    if (validCount === 0) {
      columnTypes[header] = 'string';
    } else if (numCount / validCount > 0.8) {
      columnTypes[header] = 'number';
    } else if (boolCount / validCount > 0.8) {
      columnTypes[header] = 'boolean';
    } else if (dateCount / validCount > 0.8) {
      columnTypes[header] = 'date';
    } else {
      columnTypes[header] = 'string';
    }
  });

  return {
    fileName,
    fileSize: fileSize || new Blob([csvString]).size,
    totalRows: data.length,
    totalCols: headers.length,
    headers,
    data,
    errors: result.errors,
    columnTypes,
    missingValuesCount,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
