import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {map, mergeMap, shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getStoreUrl} from '@sneat/datatug/nav';
import {GITHUB_REPO, GITLAB_REPO_PREFIX, IDatatugProjRef} from '@sneat/datatug/core';
import {IDatatugProjectFull, IDatatugProjectSummary} from '@sneat/datatug/models';
import {PrivateTokenStoreService} from '@sneat/auth';

@Injectable()
export class ProjectService {

  private projects: { [id: string]: Observable<IDatatugProjectFull> } = {};
  private projSummary: { [id: string]: Observable<IDatatugProjectSummary> } = {};

  constructor(
    private readonly db: AngularFirestore,
    private readonly http: HttpClient,
    private readonly privateTokenStoreService: PrivateTokenStoreService,
  ) {
  }

  public watchProject(id: string): Observable<IDatatugProjectSummary> {
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
        map(value => value.type === 'removed' ? undefined : value.payload.data() as IDatatugProjectSummary),
      );
  }

  public getFull(target: IDatatugProjRef): Observable<IDatatugProjectFull> {
    console.warn('The getFull() method should not be called from UI');
    if (!target) {
      throw new Error('target is a required parameter for getFull()');
    }
    let $project = this.projects[target.projectId];
    if ($project) {
      return $project;
    }
    $project = this.http
      .get<IDatatugProjectFull>(`${getStoreUrl(target.repoId)}/project-full`, {params: {id: target.projectId}})
      .pipe(
        shareReplay(1),
      )
    ;
    this.projects[target.projectId] = $project;
    return $project;
  }

  public getSummary(target: IDatatugProjRef, options?: { cachedOnly?: boolean }): Observable<IDatatugProjectSummary> {
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

  private getProjectSummaryRequest(target: IDatatugProjRef): Observable<IDatatugProjectSummary> {
  	if (!target) {
  		throw new Error('target is required parameter');
	}
    const {repoId, projectId} = target;
  	if (!repoId) {
		throw new Error('target.repoId is required parameter');
	}
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
          .get<IDatatugProjectSummary>(request.url, {headers: request.headers})
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
    const agentUrl = getStoreUrl(repoId);
    return this.http.get<IDatatugProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
  }
}

