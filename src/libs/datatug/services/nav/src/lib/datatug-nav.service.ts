import {Inject, Injectable} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';
import {IProjectContext} from '@sneat/datatug/core';
import {IProjBoard, IDatatugProjectSummary, IProjEntity, IProjEnv, IQueryDef,} from '@sneat/datatug/models';

export type ProjectTopLevelPage =
  'boards' |
  'dbmodels' |
  'entities' |
  'environments' |
  'servers' |
  'queries' |
  'query' |
  'tags' |
  'widgets';

@Injectable({
  providedIn: 'root' // TODO: embed explicitly
})
export class DatatugNavService {

  constructor(
    private readonly nav: NavController,
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
  ) {
  }

  goAgent(repoId): void {
    this.navRoot(['repo', repoId], 'Failed to navigate to repo page');
  }

  goProject(repoId: string, projectId: string, page?: ProjectTopLevelPage): void {
    const url = ['repo', repoId, 'project', projectId];
    if (page) {
      url.push(page);
    }
    this.navRoot(url, 'Failed to navigate to project page ' + page);
  }

  goEnvironment(projContext: IProjectContext, projEnv: IProjEnv, envId?: string): void {
    const url = this.projectPageUrl(projContext, 'env', projEnv?.id || envId);
    this.navForward(url, {state: {projEnv}}, 'Failed to navigate to environment page');
  }

  goEntity(projContext: IProjectContext, projEntity: IProjEntity, entityId?: string): void {
    const url = this.projectPageUrl(projContext, 'entity', projEntity?.id || entityId);
    this.navForward(url, {state: {projEntity}}, 'Failed to navigate to entity page');
  }

  goQuery(projContext: IProjectContext, query: IQueryDef, queryFullId: string, action?: 'execute' | 'edit'): void {
    const url = this.projectPageUrl(projContext, 'queries', queryFullId);
    this.navForward(url, {state: {query, action}}, 'Failed to navigate to query page');
  }

  goBoard(projContext: IProjectContext, projBoard: IProjBoard, boardId?: string): void {
    const url = this.projectPageUrl(projContext, 'board', projBoard?.id || boardId);
    this.navForward(url, {state: {projBoard}}, 'Failed to navigate to board page');
  }

  public projectPageUrl(c: IProjectContext, name: string, id: string): string {
    return `/repo/${c.repoId}/project/${c.projectId}/${name}/${encodeURIComponent(id)}`;
  }

  goProjPage(repoId: string, projectId: string, projPage: string, state?: { projSummary: IDatatugProjectSummary }): void {
    this.navForward(['repo', repoId, 'project', projectId, projPage],
      {state}, 'Failed to navigate to project page: ' + projPage);
  }

  goTable(to: IDbObjectNavParams): void {
    const url = [
      'project', `${to.target.projectId}@${to.target.repoId}`,
      'env', to.env,
      'db', to.db,
      'table', `${to.schema}.${to.name}`,
    ];
    this.navRoot(url, 'Failed to navigate to environment table page');
  }

  private navRoot(url: string[] | string, errMessage: string): void {
    console.log('navRoot', url);
    this.nav.navigateRoot(url)
      .catch(err => this.errorLogger.logError(err, errMessage));
  }

  private navForward(url: string[] | string, options: NavigationOptions, errMessage: string): void {
    console.log('navForward()', url, options);
    this.nav.navigateForward(url, options)
      .catch(err => this.errorLogger.logError(err, errMessage));
  }
}

export interface IDbObjectNavParams {
  target: IProjectContext;
  env: string;
  db: string;
  schema: string;
  name: string;
}
