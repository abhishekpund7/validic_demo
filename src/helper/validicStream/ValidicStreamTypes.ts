import {type ValidicResponseDatum} from '../validicService/ValidicTypes';

export enum ResourceFilter {
  // intraday = 'intraday',
  measurement = 'measurement',
  // nutrition = 'nutrition',
  // sleep = 'sleep',
  summary = 'summary',
  // workout = 'workout',
}

export enum EventTypefilter {
  data = 'data',
  connection = 'connection',
  rule = 'rule',
  poke = 'poke',
}

export interface CreateStreamInputParams {
  name: string;
  resource_filter?: ResourceFilter[];
  event_type_filter?: EventTypefilter[];
  start_date?: string; // YYYY-MM-DD
}

export interface CreateStreamResponse {
  id: string;
  name: string;
  group: string;
  members: number;
  start_date: string | null;
  resource_filter: ResourceFilter[] | null;
  event_type_filter: EventTypefilter[] | null;
  created_at: string;
  updated_at: string;
}

export interface GetStreamResponse {
  streams: CreateStreamResponse[];
  meta: {
    offset: number;
    limit: number;
    total: number;
    sort: string[];
  };
}

export enum ValidicResourceType {
  summaries = 'summaries',
  // workouts = 'workouts',
  measurements = 'measurements',
  // nutrition = 'nutrition',
  // sleep = 'sleep',
  // intraday = 'intraday',
}
export interface PokeData {
  ts: string; // YYYY-MM-DDThh:mm:ssZ
  stream: string;
  members: {
    count: number;
    max: number;
  };
}

export interface ConnectStreamResponse {
  event: EventTypefilter;
  data: PokeData | ValidicResponseDatum;
}
