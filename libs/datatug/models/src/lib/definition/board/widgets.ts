import { ISqlWidgetDef, SqlWidgetName } from './widget-sql';
import { UnknownWidgetDef } from './widget-def';
import { HttpWidgetName } from './widget-http';
import { ITabsWidgetDef, TabsWidgetName } from './widget-tabs-def';

export type WidgetDef = ISqlWidgetDef | ITabsWidgetDef | UnknownWidgetDef;

export type KnownWidgetName = SqlWidgetName | TabsWidgetName | HttpWidgetName;
export type WidgetName = KnownWidgetName | string;
