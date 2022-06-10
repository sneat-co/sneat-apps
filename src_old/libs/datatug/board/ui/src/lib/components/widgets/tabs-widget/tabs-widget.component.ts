import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IBoardContext, ITabsWidgetSettings } from '@sneat/datatug/models';

@Component({
	selector: 'datatug-tabs-widget',
	templateUrl: './tabs-widget.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsWidgetComponent implements OnChanges {
	public selectedTab?: string;

	@Input() level?: number;
	@Input() tabsWidgetSettings?: ITabsWidgetSettings;
	@Input() boardContext?: IBoardContext;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['tabsWidgetDef'] && !this.selectedTab) {
			this.selectedTab =
				this.tabsWidgetSettings?.tabs?.length &&
				this.tabsWidgetSettings.tabs[0].title || undefined;
		}
	}
}
