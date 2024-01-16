export enum ValidicSource {
  apple_health = 'Apple Health',
  fitbit = 'Fitbit',
}

export enum ValidicValueType {
  avg_spo2 = 'Avg SpO\u2082',
  spo2 = 'SpO\u2082',
  avg_heart_rate = 'Avg Heart Rate',
  average_heartrate = 'Average Heart Rate',
}

// Union of units from ValidicValueTypes
export enum ValidicUnit {
  percent = '%',
  'b/m' = ' b/m',
  bpm = ' bpm',
  kcal = ' kcal',
  s = ' s',
}

export interface HealthMetric {
  daily_average: boolean;
  timestamp: Date;
  value: number;
  type: ValidicValueType;
  unit: ValidicUnit;
  source: ValidicSource;
}

export const getValidicTypeIcon = (source: ValidicSource): any => {
  switch (source) {
    case ValidicSource.apple_health:
      return 'Images.validic.appleHealth';
    case ValidicSource.fitbit:
      return 'Images.validic.fitbit';
  }
};

export const enumToValue = (enumObject: object, enumKey: string): string => {
  return Object.values(enumObject)[Object.keys(enumObject).indexOf(enumKey)];
};

export const getHealthMetricIcon = (source: ValidicValueType): any => {
  switch (source) {
    case ValidicValueType.spo2:
      return 'Images.validic.spo2';
    case ValidicValueType.avg_spo2:
      return 'Images.validic.spo2';
    case ValidicValueType.average_heartrate:
      return 'Images.validic.heartRate';
    case ValidicValueType.avg_heart_rate:
      return 'Images.validic.heartRate';
    default:
      return 'Images.validic.heartRate';
  }
};

export interface ValidicResponseData {
  data: ValidicResponseDatum[];
}

export interface Device {
  id: string;
  model: string;
  manufacturer: string;
  diagnostics: object;
  name: string;
  type: string;
}

export interface Segments {
  name: string;
  metrics: ValidicResponseMetric[];
}
export interface UserNotes {
  type: string;
  value: string;
}

export interface ValidicResponseDatum {
  category: string;
  checksum: string;
  created_at: string; // YYYY-MM-DDThh:mm:ssZ
  deleted_at: string | null;
  end_time: string; // YYYY-MM-DDThh:mm:ssZ
  id: string;
  log_id: string;
  metrics: ValidicResponseMetric[];
  name: string | undefined;
  offset_origin: string;
  segments: Segments[];
  source: {
    type: ValidicSource;
    device: Device | null;
  };
  start_time: string; // YYYY-MM-DDThh:mm:ssZ
  tags: object[] | undefined;
  type: string;
  user: {
    organization_id: string;
    user_id: string;
    uid: string;
  };
  user_notes: UserNotes[];
  utc_offset: number;
  version: string;
}

export interface ValidicResponseMetric {
  type: string;
  value: number;
  origin: string;
  unit: string;
}

export interface ValidicResponseUsers {
  data: ValidicResponseUser[];
  meta: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface ValidicResponseUser {
  id: string;
  uid: string;
  marketplace: {
    token: string;
    url: string;
  };
  mobile: {
    token: string;
  };
  location: {
    timezone: string;
    country: string;
  };
  sources: ValidicSources[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ValidicSources {
  type: string;
  connected_at: string;
  last_processed_at: string;
}

export interface ValidicResponseMarketplace {
  type: string;
  connected: boolean;
  logo_url: string;
  display_name: string;
  tagline: string;
  disconnect_url?: string;
  connect_url?: string;
}
