import { IWidgetDef } from './widget';

export interface ITabsWidgetSettings {
  tabs: ITab[];
}

export interface ITab {
  title: string;
  widget: IWidgetDef;
}
