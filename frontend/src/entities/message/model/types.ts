export interface Message {
  role: 'user' | 'ai' | 'error';
  content: string;
}

export interface Model {
  id: string;
  displayName: string;
  provider: string;
}
