import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IRecordsetColumn } from '@sneat/datatug-dto';
import { IForeignKey } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-cell-popover',
	templateUrl: './cell-popover.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, RouterModule, FormsModule],
})
export class CellPopoverComponent {
	@Input() column?: IRecordsetColumn;
	@Input() value: unknown;
	@Input() fk?: IForeignKey;

	public tab: 'rec' | 'cols' | 'refs' = 'rec';
}
