export interface ButtonInfo {
  category?: string
  description: string;
  value: string;
}


export type codes = 'l4d' | 'web' | 'sw';

export interface PageInfo {
  code: codes;
  description: string;
  categories?: string[];
}