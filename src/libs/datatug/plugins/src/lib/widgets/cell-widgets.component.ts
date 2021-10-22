import { Component, Input } from '@angular/core';
import { ICellWidgetDef } from '@sneat/datatug/models';

@Component({
	selector: 'datatug-cell-widgets',
	templateUrl: 'cell-widgets.component.html',
})
export class CellWidgetsComponent {
	@Input() v: unknown;
	@Input() def?: ICellWidgetDef;
	@Input() settings?: unknown;
}
