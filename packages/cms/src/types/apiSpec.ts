export interface IAPIResponse<T=any> {
  code: number;
  msg?: string;
  message?: string; //尽量用这个
  success?: string;
  time?: string;
  token?: string;
  data?: T;
}
export type APIResponse = IAPIResponse;
export interface PageQueryParams {
  page?: number; //对应skip
  pageSize?: number; // 对应take
  sortBy?: string;
  orderBy?: string; // orderByEnum
}

export interface ApiPageData {
  offset: number;
  limit: number;
  count: number;
  totalCount: number;
  documents: any[];
}
export interface EventSourceDataInterface {
  choices: EventSourceDataChoices[];
  created: number;
  id: string;
  model: string;
  object: string;
}
export type EventSourceData = EventSourceDataInterface | '[DONE]';
export interface EventSourceDataChoices {
  delta: {
      content?: string;
      role?: string;
  };
  finish_reason?: string;
  index: number;
}

export interface Conversation {
  id: string;
  type: string;
  title: string;
  time: string;
}
