import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {EMPTY, from, Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {map, mergeMap, shareReplay, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getStoreUrl} from '@sneat/datatug/nav';
import {IProjectRef, isValidProjectRef, projectRefToString} from '@sneat/datatug/core';
import {IProjectFull, IProjectSummary, IProjStoreRef} from '@sneat/datatug/models';
import {PrivateTokenStoreService} from '@sneat/auth';
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {SneatApiServiceFactory} from "@sneat/api";
import {GITLAB_REPO_PREFIX, STORE_ID_GITHUB_COM} from '@sneat/core';

@Injectable({providedIn: 'root'})
export class ProjectService {

	private projects: { [id: string]: Observable<IProjectFull> } = {};
	private projSummary: { [id: string]: ReplaySubject<IProjectSummary> } = {};
	private readonly projectsCollection: AngularFirestoreCollection;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly http: HttpClient,
		private readonly privateTokenStoreService: PrivateTokenStoreService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
	) {
		this.projectsCollection = db.collection<IProjectSummary>('datatug_projects');
	}

	public watchProjectSummary(projectRef: IProjectRef): Observable<IProjectSummary> {
		console.log('ProjectService.watchProject', projectRef);
		if (!isValidProjectRef(projectRef)) {
			return throwError('Can not watch project by empty target parameter');
		}
		if (projectRef.storeId === 'agent') {
			throw new Error('TEMP DEBUG: storeId === agent, expected firestore');
		}
		const id = projectRefToString(projectRef);
		let subj = this.projSummary[id];
		if (subj) {
			console.log('ProjectService.watchProject() => reusing existing subject');
		} else {
			console.log('ProjectService.watchProject() => creating new subject');
			this.projSummary[id] = subj = new ReplaySubject();
			if (projectRef.storeId === 'firestore') {
				this.firestoreChanges(projectRef.projectId)
					.pipe(tap(summary => console.log(`ProjectService.watchProject(${id}) => summary:`, summary)))
					.subscribe(subj);
			}
			const m = id.match(/(\.|\w+)@(\w+:\d+)/);
			if (m) {
				this.getSummary(projectRef).pipe(shareReplay(1)).subscribe(subj)
			}
		}
		return subj.asObservable();
	}

	private firestoreChanges(id: string): Observable<IProjectSummary> {
		console.log(`ProjectService.firestoreChanges(${id})`);
		return this.projectsCollection
			.doc(id)
			.snapshotChanges()
			.pipe(
				tap(v => console.log(`project[${id}] snapshotChange:`, v)),
				map(value => value.type === 'removed' ? undefined : value.payload.data() as IProjectSummary),
				shareReplay(1),
			);
	}

	public getFull(projectRef: IProjectRef): Observable<IProjectFull> {
		console.warn('The getFull() method should not be called from UI');
		if (!projectRef) {
			throw new Error('target is a required parameter for getFull()');
		}
		let $project = this.projects[projectRef.projectId];
		if ($project) {
			return $project;
		}
		$project = this.http
			.get<IProjectFull>(`${getStoreUrl(projectRef.storeId)}/project-full`, {params: {id: projectRef.projectId}})
			.pipe(
				shareReplay(1),
			)
		;
		this.projects[projectRef.projectId] = $project;
		return $project;
	}

	public getSummary(projectRef: IProjectRef): Observable<IProjectSummary> {
		console.log('ProjectService.getSummary()', projectRef);
		if (projectRef.storeId === 'firestore') {
			return this.watchProjectSummary(projectRef).pipe(take(1));
		}
		const id = `${projectRef.storeId}|${projectRef.projectId}`;
		let subj = this.projSummary[id];
		if (subj) {
			return subj.asObservable();
		}


		this.projSummary[id] = subj = new ReplaySubject();

		this.getProjectSummaryRequest(projectRef)
			.pipe(
				shareReplay(1),
				// map(project => ({...project, id: projectId})),
			)
			.subscribe(subj);
		return subj.asObservable();
	}

	private getProjectSummaryRequest(projectRef: IProjectRef): Observable<IProjectSummary> {
		if (!projectRef) {
			throw new Error('target is required parameter');
		}
		const {storeId, projectId} = projectRef;
		if (!storeId) {
			throw new Error('target.storeId is required parameter');
		}
		if (storeId === STORE_ID_GITHUB_COM || storeId.startsWith(GITLAB_REPO_PREFIX)) {
			interface urlAndHeaders {
				url: string;
				headers?: { [name: string]: string };
			}

			let connectTo: Observable<urlAndHeaders>;
			if (storeId === STORE_ID_GITHUB_COM) {
				const [repo, org] = projectId.split('@')
				connectTo = of({url: `https://raw.githubusercontent.com/${org}/${repo}/main/datatug/datatug-project.json`});
			} else if (storeId.startsWith(GITLAB_REPO_PREFIX)) {
				//url = 'https://gitlab.dell.com/A_Trakhimenok/dsa-datatug/-/raw/master/datatug/datatug-project.json';
				connectTo = this.privateTokenStoreService.getPrivateToken(storeId, projectId).pipe(map(accessToken => (
					{
						url: `https://gitlab.dell.com/api/v4/projects/${projectId}/repository/files/datatug%2Fdatatug-project.json/raw?ref=master`,
						headers: {"PRIVATE-TOKEN": accessToken}
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
					}))),
			);
		}
		const agentUrl = getStoreUrl(storeId);
		return this.http.get<IProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
	}

	public createNewProject(
		projStoreRef: IProjStoreRef,
		projData: ICreateProjectData,
	): Observable<string> {
		const sneatApiService = this.sneatApiServiceFactory.getSneatApiService(projStoreRef);
		return sneatApiService.post<ICreateProjectData, { id: string }>('/datatug/project/create_project', projData)
			.pipe(
				map(response => response.id)
			);
	}
}

export interface ICreateProjectData {
	title: string;
	userIds: string[];
	teamId?: string;
}

