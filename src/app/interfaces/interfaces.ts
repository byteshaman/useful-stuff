export interface TagInfo {
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

export interface WebsiteInfo {
  id: number;
  description: string;
  name: string;
  tags: string[];
  url: string;
}

export type operation = 'new' | 'edit';