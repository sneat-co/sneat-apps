export interface ITeam {
  title?: string;
  metrics?: ITeamMetric[];
}

export interface IRecord<T> {
  id: string;
  data: T;
}

export interface ITeamMetric {
  title: string;
  mode: string;
  type: string;
  bool?: {
    true: { label: string; color: MetricColor };
    false: { label: string; color: MetricColor };
  };
  min?: number;
  max?: number;
}

export type MetricColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'warning'
  | 'success'
  | 'danger';
