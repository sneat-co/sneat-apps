import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IColumn, IForeignKey, ITableFull } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-table-meta-card',
	templateUrl: './table-meta-card.component.html',
	styleUrls: ['./table-meta-card.component.scss'],
	standalone: true,
	imports: [IonicModule, FormsModule, CommonModule, RouterModule],
})
export class TableMetaCardComponent {
	@Input() meta?: ITableFull;

	public tab: 'cols' | 'keys' | 'refs' = 'cols';

	public colFk(c: IColumn): IForeignKey | undefined {
		const fks = this.meta?.foreignKeys?.filter((fk) =>
			fk.columns.includes(c.name),
		);
		return fks?.length === 1 ? fks[0] : undefined;
	}
}
