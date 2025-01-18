import { HttpWidgetName } from './widget-http';
import { SqlWidgetName } from './widget-sql';
import { TabsWidgetName } from './widget-tabs-def';

export type KnownWidgetName = SqlWidgetName | TabsWidgetName | HttpWidgetName;
export type WidgetName = KnownWidgetName | string;
