export interface ISelectItem {
	readonly id: string;
	readonly title: string;
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
