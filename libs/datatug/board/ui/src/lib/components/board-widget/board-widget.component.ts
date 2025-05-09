import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
	IBoardContext,
	ISqlWidgetSettings,
	ITabsWidgetSettings,
	QueryType,
	WidgetDef,
} from '@sneat/ext-datatug-models';
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
