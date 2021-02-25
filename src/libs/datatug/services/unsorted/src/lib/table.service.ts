import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ITableFull} from '@sneat/datatug/models';

@Injectable()
export class TableService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {

  }

  public getTableMeta(request: ITableRequest): Observable<ITableFull> {
    return this.httpClient.get<ITableFull>('');
  }
}


export interface ITableRequest {
  repository: string;
  catalog: string;
  schema: string;
  name: string;
}
