/**
 * Core Export - Type Definitions
 */

export interface ExportColumn {
  field: string;
  header: string;
  width?: number;
  format?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  title?: string;
  subtitle?: string;
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';
