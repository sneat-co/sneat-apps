import { Component, Input } from '@angular/core';
import { ICellWidgetDef } from '@sneat/ext-datatug-models';
import { CellHrefWidgetComponent } from './cell-href-widget';

@Component({
	selector: 'sneat-datatug-cell-widgets',
	templateUrl: 'cell-widgets.component.html',
	imports: [CellHrefWidgetComponent],
})
export class CellWidgetsComponent {
	@Input() v: unknown;
	@Input() def?: ICellWidgetDef;
	@Input() settings?: unknown;
}
