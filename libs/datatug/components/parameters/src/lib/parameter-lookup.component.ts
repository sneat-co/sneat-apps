import { Component, Inject, Input, OnInit } from '@angular/core';
import { DataGridComponent } from '@sneat/datagrid';
import { SqlEditorComponent } from '@sneat/ext-datatug-components-sqleditor';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ModalController } from '@ionic/angular/standalone';
import {
	IParameterDef,
	IParameterValueWithoutID,
} from '@sneat/ext-datatug-models';
import {
	ICommandResponseItem,
	ICommandResponseWithRecordset,
	IExecuteResponse,
} from '@sneat/ext-datatug-dto';
import { IGridDef } from '@sneat/grid';
import {
	DatatugStoreService,
	recordsetToGridDef,
} from '@sneat/ext-datatug-services-repo';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-datatug-parameter-lookup',
	templateUrl: './parameter-lookup.component.html',
	imports: [DataGridComponent, SqlEditorComponent],
})
export class ParameterLookupComponent implements OnInit {
	@Input() parameter?: IParameterDef;
	@Input() subj?: Subject<IParameterValueWithoutID>;
	@Input() canceled?: () => void;
	@Input() storeId?: string;
	@Input() projectId?: string;
	@Input() envId?: string;
	@Input() lookupResponse?: Observable<IExecuteResponse>;

	grid?: IGridDef;

	constructor(
		private readonly repoService: DatatugStoreService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modal: ModalController,
	) {}

	ngOnInit() {
		this.lookupResponse?.pipe(first()).subscribe({
			next: (response: IExecuteResponse) => {
				console.log('Lookup got response:', response);
				try {
					const firstCommand = response.commands[0];
					const firstItem = (firstCommand.items as ICommandResponseItem[])[0];
					const itemWithRecordset = firstItem as ICommandResponseWithRecordset;
					const recordset = itemWithRecordset.value;
					this.grid = recordsetToGridDef({ result: recordset });
					console.log('this.grid:', this.grid);
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to process lookup response');
				}
			},
			error: (err) =>
				this.errorLogger.logError(
					err,
					'Failed to execute parameter lookup SQL',
				),
		});
	}

	rowClicked = (event: Event, row: unknown): void => {
		const data = (row as { getData: () => unknown }).getData() as Record<
			string,
			undefined
		>;
		const value = this.parameter?.lookup?.keyFields.map((f) => data[f])[0];
		console.log('ParameterLookupComponent.rowClicked', row, data, value);
		if (this.parameter?.type) {
			this.subj?.next({ type: this.parameter.type, value });
		}
		this.modal
			.dismiss()
			.catch((err) =>
				this.errorLogger.logError(
					err,
					'Failed to dismiss modal from ParameterLookupComponent',
				),
			);
	};
}
