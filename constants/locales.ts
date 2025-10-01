
import { Language } from '../types';

type LocaleStrings = {
  [key: string]: string;
};

export const locales: Record<Language, LocaleStrings> = {
  [Language.EN]: {
    // Header
    appName: 'AI Meeting Notes',
    language: 'Language',
    english: 'English',
    traditionalChinese: 'Traditional Chinese',
    
    // Hero View
    heroTitle: 'Transform Your Meetings with AI',
    heroSubtitle: 'Focus on the conversation, not on taking notes. Get instant transcripts, summaries, and action items.',
    startMeeting: 'Start New Meeting',

    // Meeting View
    meetingInProgress: 'Meeting in Progress...',
    stopMeeting: 'Stop Meeting & Generate Summary',
    liveTranscript: 'Live Transcript',
    generatingSummary: 'Generating Summary...',
    generatingSummaryDescription: 'Our AI is analyzing the transcript to extract key insights. This may take a moment.',
    speaker: 'Speaker',

    // Summary View
    meetingSummary: 'Meeting Summary',
    summary: 'Summary',
    actionItems: 'Action Items',
    keyDecisions: 'Key Decisions',
    fullTranscript: 'Full Transcript',
    share: 'Share',
    copiedToClipboard: 'Copied to clipboard!',
    startAnotherMeeting: 'Start Another Meeting',
    
    // Errors
    micError: 'Microphone access denied. Please allow microphone access in your browser settings to proceed.',
    apiError: 'An error occurred while communicating with the AI. Please try again.',
  },
  [Language.ZH_TW]: {
    // Header
    appName: '智慧型AI會議記錄',
    language: '語言',
    english: 'English',
    traditionalChinese: '繁體中文',

    // Hero View
    heroTitle: '用 AI 徹底改變您的會議',
    heroSubtitle: '專注於對話，而非筆記。即時獲得文字稿、摘要與行動項目。',
    startMeeting: '開始新會議',
    
    // Meeting View
    meetingInProgress: '會議進行中...',
    stopMeeting: '結束會議並生成摘要',
    liveTranscript: '即時文字稿',
    generatingSummary: '正在生成摘要...',
    generatingSummaryDescription: '我們的 AI 正在分析會議內容以提煉重點，請稍候片刻。',
    speaker: '發言人',
    
    // Summary View
    meetingSummary: '會議摘要',
    summary: '核心摘要',
    actionItems: '行動項目',
    keyDecisions: '關鍵決策',
    fullTranscript: '完整文字稿',
    share: '分享',
    copiedToClipboard: '已複製到剪貼簿！',
    startAnotherMeeting: '開始另一場會議',

    // Errors
    micError: '麥克風權限遭拒。請在您的瀏覽器設定中允許使用麥克風。',
    apiError: '與 AI 通訊時發生錯誤，請再試一次。',
  },
};
