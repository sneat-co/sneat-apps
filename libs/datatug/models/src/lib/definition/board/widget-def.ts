import { IWidgetDef } from './widget';
import { ISqlWidgetDef } from './widget-sql';
import { ITabsWidgetDef } from './widget-tabs-def';

export type WidgetDef = ISqlWidgetDef | ITabsWidgetDef | IWidgetDef;
