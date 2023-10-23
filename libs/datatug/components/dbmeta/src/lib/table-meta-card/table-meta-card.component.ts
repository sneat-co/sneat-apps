import { Component, Input } from '@angular/core';
import { IColumn, IForeignKey, ITableFull } from '@sneat/datatug-models';

@Component({
	selector: 'datatug-table-meta-card',
	templateUrl: './table-meta-card.component.html',
	styleUrls: ['./table-meta-card.component.scss'],
})
export class TableMetaCardComponent {
	@Input() meta: ITableFull;

	public tab: 'cols' | 'keys' | 'refs' = 'cols';

	public colFk(c: IColumn): IForeignKey | undefined {
		const fks = this.meta?.foreignKeys?.filter(
			(fk) => fk.columns.indexOf(c.name) >= 0,
		);
		return fks?.length === 1 ? fks[0] : undefined;
	}
}
