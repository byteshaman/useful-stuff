export type codes = 'l4d' | 'web' | 'sw';
export type operation = 'new' | 'edit';

export interface PageInfo {
  code: codes;
  description: string;
  categories?: string[];
}

export interface TagInfo {
  category?: string
  description: string;
  value: string;
}

export interface WebsiteInfo {
  id: number;
  description: string;
  name: string;
  tags: string[];
  url: string;
}