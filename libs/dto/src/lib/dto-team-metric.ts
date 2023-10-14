export type MetricColor =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'success'
	| 'danger'
	| 'warning';

export interface IBoolMetricVal {
	label: string;
	color: MetricColor;
}

export interface IBoolMetric {
	true: IBoolMetricVal;
	false: IBoolMetricVal;
}

export interface ITeamMetric {
	id?: string;
	title: string;
	colorTrue?: MetricColor;
	colorFalse?: MetricColor;
	type: 'bool' | 'integer' | 'options';
	mode: 'personal' | 'team';
	bool?: IBoolMetric;
	min?: number;
	max?: number;
}
