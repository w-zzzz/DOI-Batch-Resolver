export enum Status {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
}

export interface ReferenceItem {
  id: string;
  originalText: string;
  cleanQuery: string;
  status: Status;
  doi?: string;
  title?: string;
  score?: number;
  errorMessage?: string;
}

export interface CrossrefWork {
  DOI: string;
  title?: string[];
  score: number;
  author?: { family?: string; given?: string }[];
  'container-title'?: string[];
  published?: { 'date-parts'?: number[][] };
}

export interface CrossrefResponse {
  status: string;
  message: {
    items: CrossrefWork[];
    'total-results': number;
  };
}
