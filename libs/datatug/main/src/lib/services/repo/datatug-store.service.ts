import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { getStoreUrl } from '@sneat/api';
import { IGridColumn, IGridDef } from '@sneat/grid';
import { storeCanProvideListOfProjects } from '@sneat/core';
import { IRecordset } from '../../dto/execute';
import { IParameter } from '../../models/definition/parameter';
import { IProjectBase } from '../../models/definition/project';
import { projectsBriefFromDictToFlatList } from '../../models/interfaces';
import {
  DatatugUserService,
  IDatatugUserState,
} from '../base/datatug-user-service';

@Injectable()
export class DatatugStoreService {
  private readonly http = inject(HttpClient);
  private readonly datatugUserService = inject(DatatugUserService);

  private readonly projectsByStore: Record<string, Observable<IProjectBase[]>> =
    {};

  private datatugUserState?: IDatatugUserState;

  constructor() {
    const datatugUserService = this.datatugUserService;

    console.log('StoreService.constructor()');
    datatugUserService.datatugUserState.subscribe({
      next: (datatugUserState) => {
        this.datatugUserState = datatugUserState;
      },
    });
  }

  public getProjects(storeId: string): Observable<IProjectBase[]> {
    console.log('getProjects', storeId);
    if (!storeId) {
      return throwError(() => 'Parameter "storeId" is required');
    }
    if (!storeCanProvideListOfProjects(storeId)) {
      return this.datatugUserService.datatugUserState.pipe(
        map((datatugUserState) => {
          const result: IProjectBase[] = [];
          //
          const stores = datatugUserState.record?.datatug?.stores;
          const store = stores && stores[storeId];
          projectsBriefFromDictToFlatList(store?.projects).forEach((p) => {
            result.push(p as IProjectBase); // TODO: casting is dirty hack
          });
          //
          result.push({
            id: 'demo-project',
            title: 'Demo project',
            access: 'public',
          });
          return result;
        }),
      );
    }
    let projects = this.projectsByStore[storeId];
    if (projects) {
      return projects;
    }
    const storeUrl = getStoreUrl(storeId);
    projects = this.http
      .get<IProjectBase[]>(`${storeUrl}/projects`)
      .pipe(shareReplay(1));
    this.projectsByStore[storeId] = projects;
    return projects;
  }
}

export const recordsetToGridDef = (
  recordset: IRecordset,
  hideColumns?: string[],
): IGridDef | undefined => {
  console.log('recordsetToGridDef', recordset, hideColumns);
  if (!recordset.result) {
    return undefined;
  }
  const columns = recordset.result.columns
    .map((c, i) => ({ c, i }))
    .filter((col) => {
      const { c } = col;
      if (
        !c?.name ||
        (hideColumns && c?.name && hideColumns.includes(c.name))
      ) {
        return false;
      }
      const colDef = recordset.def?.columns?.find(
        (cDef: { name: unknown }) => cDef.name === c.name,
      );
      return !colDef?.hideIf?.parameters?.find((pId: string) =>
        recordset.parameters?.find(
          (p: IParameter) => p.id === pId && p.value !== undefined,
        ),
      );
    })
    .map((col) => {
      const { c } = col;
      const gridCol: IGridColumn = {
        field: '' + col.i,
        colName: c.name,
        dbType: c.dbType,
        title: c.name,
      };
      return gridCol;
    });
  const reducer = (r: Record<string, unknown>, v: unknown, i: number) => {
    r['' + i] = v;
    return r;
  };
  const gridDef: IGridDef = {
    columns,
    rows: recordset.result.rows?.map((row) => row.reduce(reducer, {})),
  };
  console.log('gridDef', gridDef);
  return gridDef;
};
