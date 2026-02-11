import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBoardContext } from '../../../../models/definition/board/board';
import { WidgetDef } from '../../../../models/definition/board/widget-def';
import { ISqlWidgetSettings } from '../../../../models/definition/board/widget-sql';
import { ITabsWidgetSettings } from '../../../../models/definition/board/widget-tabs';
import { QueryType } from '../../../../models/definition/query-def';
import { TabsWidgetComponent } from '../widgets/tabs-widget/tabs-widget.component';

@Component({
  selector: 'sneat-datatug-board-widget',
  templateUrl: './board-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsWidgetComponent],
})
export class BoardWidgetComponent {
  @Input() level?: number;
  @Input() cardTab?: QueryType | 'grid' | 'card';
  @Input() widgetDef?: WidgetDef;

  get tabsWidgetSettings() {
    return this.widgetDef?.data as ITabsWidgetSettings;
  }

  get sqlWidgetSettings() {
    return this.widgetDef?.data as ISqlWidgetSettings;
  }

  @Input() boardContext?: IBoardContext;
}
