
export interface Chapter {
  id: string;
  title: string;
  content: string;
  moduleNumber: number;
  lessonNumber: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  generatedLesson?: string;
  error?: string;
  // Context from previous lesson
  previousContext?: {
    title: string;
    summary: string;
  };
}

export interface AppConfig {
  systemPrompt: string;
  model: string;
  wordCount: {
    enabled: boolean;
    min: number;
    max: number;
  };
  previousContext: {
    enabled: boolean;
    summaryLength: number;
  };
}

export type Tab = 'upload' | 'queue' | 'settings' | 'preview';
