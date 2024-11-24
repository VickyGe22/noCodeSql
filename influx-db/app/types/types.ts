export interface BucketMeasurements {
  [bucketName: string]: string[];
}

export interface BucketFields {
  [bucketName: string]: {
    [measurementName: string]: string[];
  };
}

export interface BucketTags {
  [bucketName: string]: {
    [measurementName: string]: {
      [tagKey: string]: string[];
    };
  };
}

export interface BucketTagsKeys {
  [bucketName: string]: {
    [measurementName: string]: string[];
  };
}

export interface FilterConfig {
  filter: string;
  config: any;
}

export interface TimeRangeFilterConfig {
  config: {
    startDateTime: string;
    endDateTime: string;
  };
}

export interface DataThresholdFilterConfig {
  config: {
    field: string;
    condition: string;
    value?: string;
    minValue?: string;
    maxValue?: string;
  };
}

export interface SortFilterConfig {
  config: {
    columns: string;
    order: string;
  };
}
