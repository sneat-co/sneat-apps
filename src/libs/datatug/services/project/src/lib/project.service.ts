import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {map, mergeMap, shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getRepoUrl} from '@sneat/datatug/nav';
import {GITHUB_REPO, GITLAB_REPO_PREFIX, IProjectContext} from '@sneat/datatug/core';
import {IProjectFull, IProjectSummary} from '@sneat/datatug/models';
import {PrivateTokenStoreService} from '@sneat/auth';

@Injectable()
export class ProjectService {

  private projects: { [id: string]: Observable<IProjectFull> } = {};
  private projSummary: { [id: string]: Observable<IProjectSummary> } = {};

  constructor(
    private readonly db: AngularFirestore,
    private readonly http: HttpClient,
    private readonly privateTokenStoreService: PrivateTokenStoreService,
  ) {
  }

  public watchProject(id: string): Observable<IProjectSummary> {
    if (!id) {
      return throwError('Can not watch project by empty ID parameter');
    }
    const m = id.match(/(\.|\w+)@(\w+:\d+)/);
    if (m) {
      return this.getSummary({repoId: m[2], projectId: m[1]})
        // .pipe(
        // 	map(projectFull => {
        // 		const project: IProjectSummary = {
        // 			environments: projectFull.environments.map(env => ({
        // 				id: env.id,
        // 				title: env.title,
        // 			})),
        // 		};
        //
        // 		return project;
        // 	}),
        // )
        ;
    }
    return this.db.collection('DataTugProjects')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(value => value.type === 'removed' ? undefined : value.payload.data() as IProjectSummary),
      );
  }

  public getFull(target: IProjectContext): Observable<IProjectFull> {
    console.warn('The getFull() method should not be called from UI');
    if (!target) {
      throw new Error('target is a required parameter for getFull()');
    }
    let $project = this.projects[target.projectId];
    if ($project) {
      return $project;
    }
    $project = this.http
      .get<IProjectFull>(`${getRepoUrl(target.repoId)}/project-full`, {params: {id: target.projectId}})
      .pipe(
        shareReplay(1),
      )
    ;
    this.projects[target.projectId] = $project;
    return $project;
  }

  public getSummary(target: IProjectContext, options?: { cachedOnly?: boolean }): Observable<IProjectSummary> {
    const id = `${target.repoId}|${target.projectId}`;
    let $project = this.projSummary[id];
    if ($project) {
      return $project;
    }

    if (options?.cachedOnly) {
      return EMPTY;
    }
    $project = this.getProjectSummaryRequest(target)
      .pipe(
        shareReplay(1),
        // map(project => ({...project, id: projectId})),
      );
    this.projSummary[id] = $project;
    return $project;
  }

  private getProjectSummaryRequest(target: IProjectContext): Observable<IProjectSummary> {
    const {repoId, projectId} = target;
    if (repoId === GITHUB_REPO || repoId.startsWith(GITLAB_REPO_PREFIX)) {
      interface urlAndHeaders {
        url: string;
        headers?: { [name: string]: string };
      }

      let connectTo: Observable<urlAndHeaders>;
      if (repoId === GITHUB_REPO) {
        const [repo, org] = projectId.split('@')
        connectTo = of({url: `https://raw.githubusercontent.com/${org}/${repo}/main/datatug/datatug-project.json`});
      } else if (repoId.startsWith(GITLAB_REPO_PREFIX)) {
        //url = 'https://gitlab.dell.com/A_Trakhimenok/dsa-datatug/-/raw/master/datatug/datatug-project.json';
        connectTo = this.privateTokenStoreService.getPrivateToken(repoId, projectId).pipe(map(accessToken => (
          {
            url: `https://gitlab.dell.com/api/v4/projects/${projectId}/repository/files/datatug%2Fdatatug-project.json/raw?ref=master`,
            headers: {"PRIVATE-TOKEN": "QPgjyFaJwq29x9h7pVxu"}
          })));
      }
      return connectTo.pipe(
        mergeMap(request => this.http
          .get<IProjectSummary>(request.url, {headers: request.headers})
          .pipe(map(p => {
            if (p.id === projectId) {
              return p;
            }
            if (p.id) {
              console.warn(`Request project info with projectId=${projectId} but response JSON have id=${p.id}`);
            }
            return {...p, id: projectId};
          })))
      );
    }
    const agentUrl = getRepoUrl(repoId);
    return this.http.get<IProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
  }
}

