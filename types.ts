export enum Language {
  EN = 'en',
  ZH_TW = 'zhTW',
}

export enum MeetingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUMMARIZING = 'SUMMARIZING',
  FINISHED = 'FINISHED',
}

export interface SummaryData {
  summary: string;
  actionItems: string[];
  keyDecisions: string[];
}

export interface TranscriptionChunk {
  text: string;
  isFinal: boolean;
  timestamp: string;
}