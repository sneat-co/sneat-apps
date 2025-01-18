import { WidgetDef } from './widgets';

export interface ITabsWidgetSettings {
	tabs: ITab[];
}

export interface ITab {
	title: string;
	widget: WidgetDef;
}
