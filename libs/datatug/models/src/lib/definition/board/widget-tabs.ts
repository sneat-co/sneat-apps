import { WidgetDef } from './widgets';

export type TabsWidgetName = 'tabs';

export interface ITabsWidgetDef {
	name: TabsWidgetName;
	data: ITabsWidgetSettings;
}

export interface ITabsWidgetSettings {
	tabs: ITab[];
}

export interface ITab {
	title: string;
	widget: WidgetDef;
}
