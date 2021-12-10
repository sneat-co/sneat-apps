import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IRecordset } from '@sneat/datatug/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { recordsetToGridDef } from '@sneat/datatug/services/repo';
import { IGridDef } from '@sneat/grid';

@Component({
	selector: 'datatug-grid-widget',
	templateUrl: './grid-widget.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridWidgetComponent implements OnChanges {
	@Input() recordset: IRecordset;
	@Input() hideColumns?: string[];

	public grid?: IGridDef;

	constructor(
		private readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('GridWidgetComponent.ngOnChanges()', changes);
		try {
			if (changes.recordset && this.recordset) {
				this.grid = recordsetToGridDef(this.recordset, this.hideColumns);
				this.changeDetectorRef.markForCheck();
				console.log('GridWidgetComponent.ngOnChanges(): grid:', this.grid);
			}
		} catch (ex) {
			this.errorLogger.logError(
				ex,
				'Failed to process ngOnChanges by GridWidgetComponent'
			);
		}
	}
}
