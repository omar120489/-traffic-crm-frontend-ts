/**
 * Core Export - Unified Export API
 *
 * Provides consistent export functionality across CSV, XLSX, and PDF formats
 *
 * @example
 * import { exportData } from '@core/export';
 *
 * exportData({
 *   format: 'csv',
 *   filename: 'contacts-export',
 *   columns: [
 *     { field: 'name', header: 'Name' },
 *     { field: 'email', header: 'Email' }
 *   ],
 *   data: contacts
 * });
 */

export * from './types';
export { exportToCSV } from './csv';
export { exportToXLSX } from './xlsx';
export { exportToPDF } from './pdf';

import type { ExportOptions, ExportFormat } from './types';
import { exportToCSV } from './csv';
import { exportToXLSX } from './xlsx';
import { exportToPDF } from './pdf';

export interface ExportDataOptions extends ExportOptions {
  format: ExportFormat;
}

export function exportData(options: ExportDataOptions): void {
  const { format, ...exportOptions } = options;

  switch (format) {
    case 'csv':
      return exportToCSV(exportOptions);
    case 'xlsx':
      return exportToXLSX(exportOptions);
    case 'pdf':
      return exportToPDF(exportOptions);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
