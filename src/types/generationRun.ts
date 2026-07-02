export type GenerationFrequency = 'daily' | 'weekly' | 'monthly';
export type DataWindow = '7d' | '1m' | '3m' | '6m';

export const DATA_WINDOW_LABEL: Record<DataWindow, string> = {
  '7d': 'Last 7 days',
  '1m': 'Last 30 days',
  '3m': 'Last 3 months',
  '6m': 'Last 6 months',
};

export const FREQUENCY_LABEL: Record<GenerationFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export interface GenerationRun {
  id: string;
  campaignId: string;
  generatedAt: string; // ISO
  frequency: GenerationFrequency;
  dataWindow: DataWindow;
  totalRecs: number;
  pendingRecs: number;
  appliedRecs: number;
}
