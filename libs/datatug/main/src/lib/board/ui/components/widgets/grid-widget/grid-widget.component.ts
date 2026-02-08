import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { DataGridComponent } from '@sneat/datagrid';
import { IGridDef } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

@Component({
	selector: 'sneat-datatug-grid-widget',
	templateUrl: './grid-widget.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DataGridComponent],
})
export class GridWidgetComponent implements OnChanges {
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input() recordset?: IRecordset;
	@Input() hideColumns?: string[];

	public grid?: IGridDef;

	ngOnChanges(changes: SimpleChanges): void {
		console.log('GridWidgetComponent.ngOnChanges()', changes);
		try {
			if (changes['recordset'] && this.recordset) {
				this.grid = recordsetToGridDef(this.recordset, this.hideColumns);
				this.changeDetectorRef.markForCheck();
				console.log('GridWidgetComponent.ngOnChanges(): grid:', this.grid);
			}
		} catch (ex) {
			this.errorLogger.logError(
				ex,
				'Failed to process ngOnChanges by GridWidgetComponent',
			);
		}
	}
}
