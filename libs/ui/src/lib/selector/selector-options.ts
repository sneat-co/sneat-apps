import { ComponentProps } from '@ionic/core';
import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ISelectorEvents<T> {
  readonly onSelected?: (item?: T[]) => Promise<void>;
  readonly onAdded?: (item: T) => Observable<void>;
  readonly onRemoved?: (item: T) => Observable<void>;
}

export interface ISelectorOptions<T> extends ISelectorEvents<T> {
  readonly items?: Signal<readonly T[]>;
  readonly selectedItems?: readonly T[];
  readonly max?: number;
  readonly title?: string;

  componentProps?: ComponentProps<unknown>;
}
