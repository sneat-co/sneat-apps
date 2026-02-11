import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { IBoardContext } from '../../../../../models/definition/board/board';
import { ITabsWidgetSettings } from '../../../../../models/definition/board/widget-tabs';

@Component({
  selector: 'sneat-datatug-tabs-widget',
  templateUrl: './tabs-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonSegment, FormsModule, IonSegmentButton, IonLabel],
})
export class TabsWidgetComponent implements OnChanges {
  public selectedTab?: string;

  @Input() level?: number;
  @Input() tabsWidgetSettings?: ITabsWidgetSettings;
  @Input() boardContext?: IBoardContext;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabsWidgetDef'] && !this.selectedTab) {
      this.selectedTab =
        (this.tabsWidgetSettings?.tabs?.length &&
          this.tabsWidgetSettings.tabs[0].title) ||
        undefined;
    }
  }
}
