import {Inject, Injectable} from '@angular/core';
import {ISqlQueryTarget, TableService} from './table.service';
import {IAstQuery, IAstRecordset, SqlParser} from './sql-parser';
import {IForeignKey, ITableFull} from '@sneat/datatug/models';
import {BehaviorSubject} from 'rxjs';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';


const equalRecordsets = (a: IAstRecordset, b: IAstRecordset) => a.name === b.name && a.schema === b.schema;

@Injectable()
export class QueryContextSqlService {

  private readonly sqlParser = new SqlParser();

  private target: ISqlQueryTarget;
  private catalog: string;
  private repository: string;
  private server: string;
  private ast: IAstQuery;
  private tables: ITableFull[] = [];

  private _suggestedJoins = new BehaviorSubject<ICanJoin[]>(undefined);

  public readonly suggestedJoins = this._suggestedJoins.asObservable();

  private static getAutoAlias(name: string): string {
    return undefined;
  }

  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    private readonly tableService: TableService,
  ) {
  }

  public setTarget(target: ISqlQueryTarget): void {
    this.target = target;
  }

  public setSql(sql: string): IAstQuery {
    this.ast = this.sqlParser.parseQuery(sql);
    requestAnimationFrame(() => {
      this.updateMeta();
    });
    return this.ast;
  }

  private allAstRecordset(): IAstRecordset[] {
    return [
      this.ast.from,
      ...this.ast.joins,
    ].filter(rs => this.tables.find(t => t.name === rs.name && t.schema === rs.schema));
  }

  private updateMeta(): void {
    const recordsets = this.allAstRecordset();
    recordsets.forEach(rs => {
      this.tableService
        .getTableMeta({repository: this.repository, catalog: this.catalog, server: this.server, schema: rs.schema, name: rs.name})
        .subscribe({
          next: this.processTable,
          error: this.errorLogger.logErrorHandler(
            `failed to load table metadata for [${rs.schema}].[${rs.name}]`),
        });
    })
  }

  private processTable = (table: ITableFull): void => {
    if (!this.tables.find(t => t.name === table.name && t.schema == table.schema)) {
      this.tables.push(table);
    }
    this.updateSuggestedJoins(table);
  }

  private updateSuggestedJoins(table: ITableFull): void {
    const recordset = this.allAstRecordset().find(rs => rs.name === table.name && rs.schema === table.schema);
    if (!recordset) {
      return;
    }
    if (table.foreignKeys?.length) {
      this.updateSuggestedJoinForForeignKeys(recordset, table);
    }
    if (table.referencedBy?.length) {
      this.updateSuggestedJoinForRefsBy(recordset, table);
    }
  }

  private getSuggestedJoinByToRecordset(rs: IAstRecordset): ICanJoin {
    return this._suggestedJoins.value
      ?.find(sj => sj.to.recordset.name === rs.name && sj.to.recordset.schema === rs.schema);
  }

  private updateSuggestedJoinForRefsBy(rs: IAstRecordset, table: ITableFull): void {
    return this.updateSuggestedJoinFor(table, 'refBy', table.referencedBy.map(refBy => ({
      rs: {schema: refBy.schema, name: refBy.name},
    })));
  }

  private updateSuggestedJoinForForeignKeys(rs: IAstRecordset, table: ITableFull): void {
    return this.updateSuggestedJoinFor(table, 'fk', table.foreignKeys.map(fk => ({
      fk, rs: {schema: fk.refTable.schema, name: fk.refTable.name},
    })));
  }

  private updateSuggestedJoinFor(table: ITableFull, reason: JoinReason, tos: IJoinToRef[]): void {
    let joins = [...this._suggestedJoins.value || []];
    let updated = false;
    tos.forEach(to => {
      let sj = this.getSuggestedJoinByToRecordset(to.rs);
      const from = sj?.from?.find(f => f.reason === reason && equalRecordsets(f.recordset, to.rs));
      if (from) {
        return;
      }
      updated = true;
      if (sj) {
        sj = {...sj, from: [...(sj.from || []), {recordset: to.rs, fk: to.fk, table, reason}]};
        joins = joins.map(j => equalRecordsets(j.to.recordset, to.rs) ? sj : j)
      } else {
        if (joins.indexOf(sj) < 0) {
          joins.push(sj);
        }
      }
    });
    if (updated) {
      this._suggestedJoins.next(joins);
    }
  }
}

interface IJoinToRef {
  rs: IAstRecordset;
  fk?: IForeignKey;
}

export type JoinReason = 'fk' | 'refBy';

export interface IJoinFrom {
  reason: JoinReason;
  recordset: IAstRecordset;
  table: ITableFull;
  fk?: IForeignKey;
}

export interface IJoinTo {
  recordset?: IAstRecordset;
  table?: ITableFull;
}

export interface ICanJoin {
  from: IJoinFrom[];
  to?: IJoinTo;
}
