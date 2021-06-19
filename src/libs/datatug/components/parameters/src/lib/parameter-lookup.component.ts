import {Component, Inject, Input, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';
import {ModalController} from '@ionic/angular';
import {IParameterDef, IParameterValueWithoutID} from '@sneat/datatug/models';
import {ICommandResponseWithRecordset, IExecuteResponse} from '@sneat/datatug/dto';
import {IGridDef} from '@sneat/grid';
import {recordsetToGridDef, DatatugStoreService} from '@sneat/datatug/services/repo';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
	selector: 'datatug-parameter-lookup',
	templateUrl: './parameter-lookup.component.html',
	styleUrls: ['./parameter-lookup.component.scss'],
})
export class ParameterLookupComponent implements OnInit {

	@Input() parameter: IParameterDef;
	@Input() subj: Subject<IParameterValueWithoutID>;
	@Input() canceled: () => void;
	@Input() repoId: string;
	@Input() projectId: string;
	@Input() envId: string;
	@Input() lookupResponse: Observable<IExecuteResponse>;

	grid: IGridDef;

	constructor(
		private readonly repoService: DatatugStoreService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modal: ModalController,
	) {
	}

	ngOnInit() {
		this.lookupResponse
			.pipe(first())
			.subscribe({
				next: response => {
					console.log('Lookup got response:', response);
					try {
						const itemWithRecordset = response.commands[0].items[0] as ICommandResponseWithRecordset
						const recordset = itemWithRecordset.value;
						this.grid = recordsetToGridDef({result: recordset});
						console.log('this.grid:', this.grid);
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process lookup response');
					}
				},
				error: err => this.errorLogger.logError(err, 'Failed to execute parameter lookup SQL'),
			});
	}

	rowClicked = (event: Event, row: { getData: () => any }): void => {
		const data = row.getData();
		const value = this.parameter.lookup.keyFields.map(f => data[f])[0];
		console.log('ParameterLookupComponent.rowClicked', row, data, value);
		this.subj.next({type: this.parameter.type, value});
		this.modal.dismiss().catch(err => this.errorLogger.logError(err, 'Failed to dismiss modal from ParameterLookupComponent'));
	}
}
