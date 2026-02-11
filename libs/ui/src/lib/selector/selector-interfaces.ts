export type IonicColor =
  | 'danger'
  | 'success'
  | 'warning'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'dark'
  | 'medium'
  | 'light';

export interface ISelectItem {
  readonly id: string;
  readonly title: string;
  readonly shortTitle?: string;
  readonly longTitle?: string;
  readonly description1?: string;
  readonly description2?: string;
  readonly emoji?: string;
  readonly iconName?: string;
  readonly iconColor?: IonicColor;
  readonly labelColor?: IonicColor;
}

export interface ISelectItemEvent {
  item: ISelectItem;
  event: Event;
}
