import { Component, Input, OnInit, inject } from '@angular/core';
import { DataGridComponent } from '@sneat/datagrid';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ModalController } from '@ionic/angular/standalone';
import { IGridDef } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ICommandResponseItem } from '../../dto/command-response';
import { IExecuteResponse } from '../../dto/execute';
import { ICommandResponseWithRecordset } from '../../dto/response';
import {
  IParameterDef,
  IParameterValueWithoutID,
} from '../../models/definition/parameter';
import {
  DatatugStoreService,
  recordsetToGridDef,
} from '../../services/repo/datatug-store.service';
import { SqlEditorComponent } from '../sqleditor/sql-editor.component';

@Component({
  selector: 'sneat-datatug-parameter-lookup',
  templateUrl: './parameter-lookup.component.html',
  imports: [DataGridComponent, SqlEditorComponent],
})
export class ParameterLookupComponent implements OnInit {
  private readonly repoService = inject(DatatugStoreService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly modal = inject(ModalController);

  @Input() parameter?: IParameterDef;
  @Input() subj?: Subject<IParameterValueWithoutID>;
  @Input() canceled?: () => void;
  @Input() storeId?: string;
  @Input() projectId?: string;
  @Input() envId?: string;
  @Input() lookupResponse?: Observable<IExecuteResponse>;

  grid?: IGridDef;

  ngOnInit() {
    this.lookupResponse?.pipe(first()).subscribe({
      next: (response: IExecuteResponse) => {
        try {
          const firstCommand = response.commands[0];
          const firstItem = (firstCommand.items as ICommandResponseItem[])[0];
          const itemWithRecordset = firstItem as ICommandResponseWithRecordset;
          const recordset = itemWithRecordset.value;
          this.grid = recordsetToGridDef({ result: recordset });
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
