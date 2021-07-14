import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IBoardContext, WidgetDef} from '@sneat/datatug/models';

@Component({
	selector: 'datatug-board-widget',
	templateUrl: './board-widget.component.html',
	styleUrls: ['./board-widget.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardWidgetComponent {

	@Input() level: number;
	@Input() cardTab: string;
	@Input() widgetDef: WidgetDef;
	@Input() boardContext: IBoardContext;
}
