import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {EMPTY, Observable, throwError} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getRepoUrl} from '@sneat/datatug/services/nav';
import {GITHUB_REPO, IProjectContext} from '@sneat/datatug/core';
import {IProjectFull, IProjectSummary} from '@sneat/datatug/models';

@Injectable()
export class ProjectService {

	private projects: { [id: string]: Observable<IProjectFull> } = {};
	private projSummary: { [id: string]: Observable<IProjectSummary> } = {};

	constructor(
		private readonly db: AngularFirestore,
		private readonly http: HttpClient,
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
		switch (repoId) {
			case GITHUB_REPO:
				const [repo, org] = projectId.split('@')
				return this.http
					.get<IProjectSummary>(
						`https://raw.githubusercontent.com/${org}/${repo}/main/datatug/datatug-project.json`)
					.pipe(map(p => {
						if (p.id === projectId) {
							return p;
						}
						if (p.id) {
							console.warn(`Request project info with projectId=${projectId} but response JSON have id=${p.id}`);
						}
						return {...p, id: projectId};
					}));
			default:
				const agentUrl = getRepoUrl(repoId);
				return this.http.get<IProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
		}
	}
}

