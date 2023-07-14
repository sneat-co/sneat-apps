import { Component, Input } from '@angular/core';
import { IRecordsetColumn } from '@sneat/datatug/dto';
import { IForeignKey } from '@sneat/datatug/models';

@Component({
	selector: 'sneat-datatug-cell-popover',
	templateUrl: './cell-popover.component.html',
})
export class CellPopoverComponent {
	@Input() column?: IRecordsetColumn;
	@Input() value: unknown;
	@Input() fk?: IForeignKey;

	public tab: 'rec' | 'cols' | 'refs' = 'rec';
}
