export interface ISelectItem {
	readonly id: string;
	readonly title: string;
	readonly emoji?: string;
	readonly iconName?: string;
}

export interface ISelectItemEvent {
	item: ISelectItem;
	event: Event;
}
