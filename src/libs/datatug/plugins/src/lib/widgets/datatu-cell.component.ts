import {Component, Input} from '@angular/core';
import {ICellWidgetDef} from '../../../../models/src/lib/definition/cell-widget';

@Component({
	selector: 'datatug-cell-widgets',
	templateUrl: 'datatug-cell.component.html',
})
export class CellWidgetsComponent {
	@Input() v: unknown;
	@Input() def?: ICellWidgetDef;
	@Input() settings?: unknown;
}
