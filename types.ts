
export interface Chapter {
  id: string;
  title: string;
  content: string;
  moduleNumber: number;
  lessonNumber: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  generatedLesson?: string;
  error?: string;
}

export interface AppConfig {
  systemPrompt: string;
  model: string;
}

export type Tab = 'upload' | 'queue' | 'settings' | 'preview';
