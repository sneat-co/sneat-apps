export interface ISelectItem {
	readonly id: string;
	readonly title: string;
	readonly shortTitle?: string;
	readonly longTitle?: string;
	readonly description1?: string;
	readonly description2?: string;
	readonly emoji?: string;
	readonly iconName?: string;
	readonly labelColor?:
		| 'medium'
		| 'danger'
		| 'success'
		| 'warning'
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'dark'
		| 'light';
}

export interface ISelectItemEvent {
	item: ISelectItem;
	event: Event;
}
