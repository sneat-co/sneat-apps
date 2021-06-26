import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {EMPTY, from, Observable, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {map, mergeMap, shareReplay, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getStoreUrl} from '@sneat/datatug/nav';
import {IDatatugProjRef, isValidProjectTargetRef, projectRefToString} from '@sneat/datatug/core';
import {IDatatugProjectFull, IDatatugProjectSummary, IProjStoreRef} from '@sneat/datatug/models';
import {PrivateTokenStoreService} from '@sneat/auth';
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {SneatApiServiceFactory} from "@sneat/api";
import {GITLAB_REPO_PREFIX, STORE_ID_GITHUB_COM} from '@sneat/core';

@Injectable({providedIn: 'root'})
export class ProjectService {

	private projects: { [id: string]: Observable<IDatatugProjectFull> } = {};
	private projSummary: { [id: string]: ReplaySubject<IDatatugProjectSummary> } = {};
	private readonly projectsCollection: AngularFirestoreCollection;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly http: HttpClient,
		private readonly privateTokenStoreService: PrivateTokenStoreService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
	) {
		this.projectsCollection = db.collection<IDatatugProjectSummary>('datatug_projects');
	}

	public watchProjectSummary(target: IDatatugProjRef): Observable<IDatatugProjectSummary> {
		console.log('ProjectService.watchProject', target);
		if (!isValidProjectTargetRef(target)) {
			return throwError('Can not watch project by empty target parameter');
		}
		if (target.storeId === 'agent') {
			throw new Error('TEMP DEBUG: storeId === agent, expected firestore');
		}
		const id = projectRefToString(target);
		let subj = this.projSummary[id];
		if (!subj) {
			this.projSummary[id] = subj = new ReplaySubject()
			if (target.storeId === 'firestore') {
				this.firestoreChanges(target.projectId)
					// .pipe(
					// 	tap(summary => console.log(`ProjectService.watchProject(${id}) =>`, summary))
					// )
					.subscribe(subj);
			}
			const m = id.match(/(\.|\w+)@(\w+:\d+)/);
			if (m) {
				this.getSummary(target).pipe(shareReplay(1)).subscribe(subj)
			}
		}
		return subj.asObservable();
	}

	private firestoreChanges(id: string): Observable<IDatatugProjectSummary> {
		console.log(`ProjectService.firestoreChanges(${id})`);
		return this.projectsCollection
			.doc(id)
			.snapshotChanges()
			.pipe(
				tap(v => console.log(`project[${id}] snapshotChange:`, v)),
				map(value => value.type === 'removed' ? undefined : value.payload.data() as IDatatugProjectSummary),
				shareReplay(1),
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
			.get<IDatatugProjectFull>(`${getStoreUrl(target.storeId)}/project-full`, {params: {id: target.projectId}})
			.pipe(
				shareReplay(1),
			)
		;
		this.projects[target.projectId] = $project;
		return $project;
	}

	public getSummary(target: IDatatugProjRef): Observable<IDatatugProjectSummary> {
		console.log('ProjectService.getSummary()', target);
		if (target.storeId === 'firestore') {
			return this.watchProjectSummary(target).pipe(take(1));
		}
		const id = `${target.storeId}|${target.projectId}`;
		let subj = this.projSummary[id];
		if (subj) {
			return subj.asObservable();
		}


		this.projSummary[id] = subj = new ReplaySubject();

		this.getProjectSummaryRequest(target)
			.pipe(
				shareReplay(1),
				// map(project => ({...project, id: projectId})),
			)
			.subscribe(subj);
		return subj.asObservable();
	}

	private getProjectSummaryRequest(target: IDatatugProjRef): Observable<IDatatugProjectSummary> {
		if (!target) {
			throw new Error('target is required parameter');
		}
		const {storeId, projectId} = target;
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
					.get<IDatatugProjectSummary>(request.url, {headers: request.headers})
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
		return this.http.get<IDatatugProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
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

