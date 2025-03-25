import { Component, Input } from '@angular/core';
import { ICellWidgetDef } from '@sneat/ext-datatug-models';

@Component({
	selector: 'sneat-datatug-cell-widgets',
	templateUrl: 'cell-widgets.component.html',
	standalone: false,
})
export class CellWidgetsComponent {
	@Input() v: unknown;
	@Input() def?: ICellWidgetDef;
	@Input() settings?: unknown;
}
