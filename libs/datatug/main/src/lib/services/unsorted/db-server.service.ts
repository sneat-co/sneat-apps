import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { getStoreUrl } from '@sneat/api';
import { IProjectRef } from '../../core/project-context';
import { GetServerDatabasesRequest } from '../../dto/requests';
import {
  IDbCatalogSummary,
  IDbServer,
  IDbServerSummary,
  IProjDbServerSummary,
} from '../../models/definition/apis/database';
import { ProjectContextService } from '../project/project-context.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class DbServerService {
  private readonly http = inject(HttpClient);
  private readonly projectContextService = inject(ProjectContextService);
  private readonly projectService = inject(ProjectService);

  public getDbServerSummary(dbServer: IDbServer): Observable<IDbServerSummary> {
    const target = this.projectContextService?.current;
    if (!target) {
      return throwError(new Error('projectContextService.current is not set'));
    }
    const params = {
      proj: target.projectId,
      ...dbServer,
    };
    return this.http.get<IDbServerSummary>(
      `${getStoreUrl(target.storeId)}/dbserver-summary`,
      { params },
    );
  }

  public getServerDatabases(
    request: GetServerDatabasesRequest,
  ): Observable<IDbCatalogSummary[]> {
    console.log('DbServerService.getDatabaseCatalogs()', request);
    const target = this.projectContextService.current;
    if (!target) {
      throw new Error('projectContextService.current is not defined');
    }
    const params = {
      ...request.dbServer,
      proj: request.project || target.projectId,
    };
    return this.http.get<IDbCatalogSummary[]>(
      `${getStoreUrl(target.storeId)}/dbserver-databases`,
      { params },
    );
  }

  public addDbServer(dbServer: IDbServer): Observable<IDbServerSummary> {
    const target = this.projectContextService.current;
    if (!target) {
      throw new Error('this.projectContextService.current is not defined');
    }
    const params = { proj: target.projectId, ...dbServer };
    return this.http.post<IDbServerSummary>(
      `${getStoreUrl(target.storeId)}/dbserver-add`,
      undefined,
      { params },
    );
  }

  public deleteDbServer(dbServer: IDbServer): Observable<void> {
    console.log('deleteDbServer', dbServer);
    const target = this.projectContextService.current;
    if (!target) {
      throw new Error('this.projectContextService.current is not defined');
    }
    const params = { proj: target.projectId, ...dbServer };
    return this.http.delete<void>(
      `${getStoreUrl(target.storeId)}/dbserver-delete`,
      { params },
    );
  }

  public getDbServers(
    projectRef: IProjectRef,
  ): Observable<IProjDbServerSummary[]> {
    console.log('getDbServers()', projectRef);
    return this.projectService.getFull(projectRef).pipe(
      map((p) =>
        p.dbServers?.map((dbServerFull) => ({
          dbServer: dbServerFull.dbServer,
          databasesCount: dbServerFull.databases?.length || 0,
        })),
      ),
    );
  }
}
