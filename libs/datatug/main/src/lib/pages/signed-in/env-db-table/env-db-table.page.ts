import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { CodeEditor } from '@acrodata/code-editor';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  PopoverController,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IGridColumn, IGridDef } from '@sneat/grid';
import { Subject } from 'rxjs';
import { CellPopoverComponent, DataGridComponent } from '@sneat/datagrid';
import { ColumnComponent } from 'tabulator-tables';
import { IExecuteResponse, IRecordsetResult } from '../../../dto/execute';
import { ICommandResponseWithRecordset } from '../../../dto/response';
import { IForeignKey } from '../../../models/definition/apis/database';
import { IEnvDbTableContext, IProjectContext } from '../../../nav/nav-models';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import {
  DatatugNavService,
  IDbObjectNavParams,
} from '../../../services/nav/datatug-nav.service';
import { ProjectService } from '../../../services/project/project.service';
import { AgentService } from '../../../services/repo/agent.service';
import { ForeignKeyCardComponent } from './foreign-key-card/foreign-key-card.component';

@Component({
  selector: 'sneat-datatug-env-db-table',
  templateUrl: './env-db-table.page.html',
  styleUrls: ['./env-db-table.page.scss'],
  imports: [
    ForeignKeyCardComponent,
    CodeEditor,
    DataGridComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    FormsModule,
    IonButton,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonSelectOption,
    IonSelect,
    IonIcon,
    IonInput,
    IonSegment,
    IonItemDivider,
    IonBadge,
    IonList,
    IonCardContent,
    IonText,
  ],
})
export class EnvDbTablePageComponent implements OnDestroy {
  private readonly datatugNavContextService = inject(DatatugNavContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly projService = inject(ProjectService);
  private readonly agentService = inject(AgentService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly popoverController = inject(PopoverController);
  private readonly datatugNavService = inject(DatatugNavService);

  project?: IProjectContext;
  envId?: string;
  dbId?: string;

  public tab: 'grid' | 'record' | 'keys' | 'references' = 'grid';
  public cardTab: 'fks' | 'refs' = 'fks';

  public table?: IEnvDbTableContext;
  public tableNavParams?: IDbObjectNavParams;

  public groupByFk?: string;
  public groupByFks?: IForeignKey[];
  public grid?: IGridDef;
  public currentRow?: {
    index: number;
    data?: Record<string, unknown>;
  };
  public sql = 'select * from';

  public step = 'initial';
  public recordset?: IRecordsetResult;

  private readonly destroyed = new Subject<void>();

  constructor() {
    const route = this.route;
    // const projectTracker = new ProjectTracker(this.destroyed, route);
    try {
      const { paramMap } = route.snapshot;
      const [schema, name] = (paramMap.get('tableId') || '').split('.');
      this.table = { schema, name };
      this.envId = paramMap.get('environmentId') || undefined;
      this.dbId = paramMap.get('dbId') || undefined;
      if (this.envId && this.dbId && this.project) {
        this.tableNavParams = {
          project: this.project,
          env: this.envId,
          db: this.dbId,
          schema,
          name,
        };
      }

      this.datatugNavContextService.currentProject.subscribe({
        next: (currentProject) => {
          console.log(
            'EnvDbTablePage.constructor() => currentProject',
            currentProject,
          );
          try {
            this.project = currentProject;
          } catch (e) {
            this.errorLogger.logError(e, 'Failed to process current project');
          }
        },
        error: (err) =>
          this.errorLogger.logError(
            err,
            'EnvDbTablePage: failed to get current project',
          ),
      });
      this.datatugNavContextService.currentEnvDbTable.subscribe({
        next: (currentTable) => {
          try {
            this.table = currentTable;
            if (!currentTable) {
              return;
            }
            this.groupByFks = currentTable.meta?.foreignKeys?.filter(
              (fk) => fk.columns.length === 1,
            );
            const from =
              currentTable.schema === 'dbo'
                ? currentTable.name
                : `${currentTable.schema}.${currentTable.name}`;
            this.sql = `select *
from ${from}`;
            // this.codemirrorComponent?.codeMirror?.refresh();
            if (currentTable.meta) {
              this.grid = {
                columns:
                  this.table?.meta?.columns?.map((col) => ({
                    field: col.name,
                    title: col.name,
                    dbType: col.dbType,
                  })) || [],
              };
              this.loadData();
            }
          } catch (e) {
            this.errorLogger.logError(e, 'Failed to process current table');
          }
        },
        error: (err) =>
          this.errorLogger.logError(err, 'Failed to get current table context'),
      });
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to create EnvDbTablePage');
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public tabChanged(): void {
    // Tab change handler - no action needed
  }

  // public selectRow(event: RowDoubleClickedEvent): void {
  // 	console.log('selectRow', event);
  // 	this.setCurrentRow(event.rowIndex, event.data);
  // 	this.tab = 'record';
  // }

  public setCurrentRow(index: number, data?: Record<string, unknown>): void {
    try {
      if (!data) {
        const rows = this.grid?.rows;
        data = rows && rows[index];
      }
      this.currentRow = { index, data };
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to set current row');
    }
  }

  public onGroupByFkChanged(): void {
    this.setupGrid();
  }

  goTable(schema: string, name: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.project || !this.envId || !this.dbId) {
      return;
    }
    this.datatugNavService.goTable({
      project: this.project,
      env: this.envId,
      db: this.dbId,
      schema,
      name,
    });
  }

  protected colValue(colName: string): string {
    return this.currentRow?.data ? '' + this.currentRow.data[colName] : '';
  }

  private cellFormatter = (
    cell: {
      getValue: () => unknown;
      getElement: () => HTMLElement;
      getColumn: () => ColumnComponent;
    },
    formatterParams: unknown,
    onRendered: (f: () => void) => void,
  ) => {
    try {
      const value = cell.getValue();
      onRendered(() => {
        try {
          const el: HTMLElement = cell.getElement();
          const colDef = cell.getColumn().getDefinition();
          const { field } = colDef;
          const fk = field ? this.getColFk(field) : undefined;
          const col = this.table?.meta?.columns?.find((c) => c.name === field);
          // console.log('cellFormatter', field, value, colDef, col);
          if (col?.dbType === 'uniqueidentifier') {
            el.style.fontSize = 'smaller';
          }
          if (fk) {
            el.style.color = 'blue';
            el.onclick = (event) => {
              this.popoverController
                .create({
                  component: CellPopoverComponent,
                  event,
                  componentProps: { column: { name: colDef.field }, value, fk },
                  cssClass: 'cell-popover',
                  // showBackdrop: false,
                })
                .then((p) => {
                  p.present().catch((e) =>
                    this.errorLogger.logError(
                      e,
                      'Failed to present cell popover',
                    ),
                  );
                })
                .catch((e) =>
                  this.errorLogger.logError(
                    e,
                    'Failed to present cell popover',
                  ),
                );
            };
          }
        } catch (e) {
          this.errorLogger.logError(e, 'Failed to alter rendered cell');
        }
      });
      return value;
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to render cell');
      return '' + e;
    }
  };

  private getColFk(field: string) {
    return this.table?.meta?.foreignKeys?.find((v) =>
      v.columns.includes(field),
    );
  }

  private loadData(): void {
    if (!this.project || !this.envId || !this.dbId || !this.table?.meta?.name) {
      return;
    }
    try {
      this.step = 'loadData';
      this.agentService
        .select(this.project?.ref.storeId, {
          proj: this.project?.ref?.projectId,
          env: this.envId,
          db: this.dbId,
          from: this.table.meta.name,
          limit: 100,
        })
        .pipe(first())
        .subscribe({
          next: (response) => {
            this.step = 'got response';
            this.processResponse(response);
          },
          error: (err) =>
            this.errorLogger.logError(err, 'Failed to select from table'),
        });
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to load data');
    }
  }

  private processResponse = (response: IExecuteResponse): void => {
    try {
      this.step = 'processResponse';
      const firstCommand = response.commands?.length
        ? response.commands[0]
        : undefined;
      const firstItem = firstCommand?.items?.[0];
      const itemWithRecordset = firstItem as ICommandResponseWithRecordset;
      this.recordset = itemWithRecordset?.value;
      this.setupGrid();
    } catch (ex) {
      this.errorLogger.logError(ex, 'Failed to process response');
    }
  };

  private setupGrid(): void {
    this.step = 'setupGrid';
    const cols = this.recordset?.columns;
    if (!cols) {
      throw new Error('!cols');
    }
    try {
      const groupBy =
        this.groupByFk &&
        this.table?.meta?.foreignKeys?.find((fk) => fk.name === this.groupByFk)
          ?.columns[0];
      this.grid = {
        groupBy,
        columns: cols
          .filter((c) => c.name !== groupBy)
          .map((c) => {
            const col: IGridColumn = {
              field: c.name,
              dbType: c.dbType,
              title: c.title || c.name,
              // sortable: true,
              // tooltip: (cell: CellComponent) =>
              // 	// function should return a string for the tooltip of false to hide the tooltip
              // 	`${cell.getColumn().getField()}: ${cell.getValue()}`, // return cells "field - value";
              // formatter:
              // 	(c.dbType === 'UNIQUEIDENTIFIER' || this.getColFk(c.name)) &&
              // 	this.cellFormatter,
              hozAlign: c.dbType === 'integer' ? 'right' : undefined,
            };
            return col;
          }),
        rows: this.recordset?.rows.map((row) => {
          const r: Record<string, unknown> = {};
          cols?.forEach((col, i) => (r[col.name] = row[i]));
          return r;
        }),
      };
      const gridRows = this.grid?.rows;
      const l = this.grid?.rows?.length;
      if (gridRows && l) {
        const index = Math.min(this.currentRow?.index || 0, l - 1);
        const data = gridRows[index];
        this.setCurrentRow(index, data);
      }
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to setup grid');
    }
  }
}
