export interface CodeVariation {
  id: string;
  code: string;
  style: string;
  quality: number;
  size: string;
  lines: number;
  status?: 'pending' | 'generating' | 'completed' | 'error';
  progress?: number;
}

export interface GenerationProgress {
  variationId: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  code?: string;
}

export interface Project {
  id: number;
  name: string;
  prompt: string;
  variations?: CodeVariation[];
  userId?: number;
  createdAt?: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface WebSocketMessage {
  type: string;
  generationId?: string;
  update?: GenerationProgress;
  [key: string]: any;
}
