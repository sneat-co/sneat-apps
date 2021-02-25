import {Injectable} from '@angular/core';
import {TableService} from './table.service';
import {IAstQuery, IAstRecordset, SqlParser} from './sql-parser';
import {ITableFull} from '@sneat/datatug/models';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class QueryContextSqlService {

  private readonly sqlParser = new SqlParser();

  private catalog: string;
  private ast: IAstQuery;

  private _suggestedJoins = new BehaviorSubject<ICanJoin[]>(undefined);

  public readonly suggestedJoins = this._suggestedJoins.asObservable();

  constructor(
    private readonly tableService: TableService,
  ) {
  }

  public setCatalog(catalog: string): void {
    this.catalog = catalog;
  }

  public setSql(sql: string): IAstQuery {
    this.ast = this.sqlParser.parseQuery(sql);
    requestAnimationFrame(() => {
      this.updateMeta();
    });
    return this.ast;
  }

  private updateMeta(): void {
    this.ast.from.
  }

}

export interface ICanJoin {
  to: ITableFull;
  from: IAstRecordset[];
}
