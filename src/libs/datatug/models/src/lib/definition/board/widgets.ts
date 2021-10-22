import { ISqlWidgetDef, SqlWidgetName } from './widget-sql';
import { ITabsWidgetDef, TabsWidgetName } from './widget-tabs';
import { UnknownWidgetDef } from './widget-def';
import { HttpWidgetName } from './widget-http';

export type WidgetDef = ISqlWidgetDef | ITabsWidgetDef | UnknownWidgetDef;

export type KnownWidgetName = SqlWidgetName | TabsWidgetName | HttpWidgetName;
export type WidgetName = KnownWidgetName | string;
