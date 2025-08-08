import { ITabsWidgetSettings } from './widget-tabs';

export type TabsWidgetName = 'tabs';

export interface ITabsWidgetDef {
	name: TabsWidgetName;
	data: ITabsWidgetSettings;
}
