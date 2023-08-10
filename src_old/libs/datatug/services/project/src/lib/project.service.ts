import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { getStoreUrl, SneatApiServiceFactory } from '@sneat/api';
import { IProjectRef, isValidProjectRef, projectRefToString } from '@sneat/datatug/core';
import { IProjectFull, IProjectSummary } from '@sneat/datatug/models';
import { PrivateTokenStoreService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { GITLAB_REPO_PREFIX, STORE_ID_GITHUB_COM, STORE_TYPE_GITHUB } from '@sneat/core';
import { DatatugStoreServiceFactory } from '@sneat/datatug/services/repo';

@Injectable({ providedIn: 'root' })
export class ProjectService {
	private projects: { [id: string]: Observable<IProjectFull> } = {};
	private projSummary: { [id: string]: ReplaySubject<IProjectSummary | undefined> } = {};
	private readonly projectsCollection: AngularFirestoreCollection;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly http: HttpClient,
		private readonly privateTokenStoreService: PrivateTokenStoreService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
		private readonly datatugStoreServiceFactory: DatatugStoreServiceFactory,
	) {
		this.projectsCollection =
			db.collection<IProjectSummary>('datatug_projects');
	}

	public watchProjectSummary(
		projectRef: IProjectRef,
	): Observable<IProjectSummary | undefined> {
		console.log('ProjectService.watchProjectSummary', projectRef);
		if (!isValidProjectRef(projectRef)) {
			return throwError(
				() => 'Can not watch project by empty target parameter',
			);
		}
		if (projectRef.storeId === 'agent') {
			throw new Error('TEMP DEBUG: storeId === agent, expected firestore');
		}
		const id = projectRefToString(projectRef);
		if (!id) {
			throw new Error('project id is undefined');
		}
		let subj = this.projSummary[id];
		if (subj) {
			console.log(
				'ProjectService.watchProjectSummary() => reusing existing subject',
			);
		} else {
			console.log(
				'ProjectService.watchProjectSummary() => creating new subject for',
				id,
			);
			this.projSummary[id] = subj = new ReplaySubject(1);
			if (projectRef.storeId === 'firestore') {
				this.firestoreChanges(projectRef.projectId)
					.pipe(
						tap((summary) =>
							console.log(
								`ProjectService.watchProject(${id}) => summary:`,
								summary,
							),
						),
					)
					.subscribe(subj);
			}
			this.getSummary(projectRef).pipe(shareReplay(1)).subscribe(subj);
			// const m = id.match(/(\.|\w+)@(\w+:\d+)()/);
			// if (m) {
			// }
		}
		return subj.asObservable();
	}

	private firestoreChanges(id: string): Observable<IProjectSummary | undefined> {
		console.log(`ProjectService.firestoreChanges(${id})`);
		return this.projectsCollection
			.doc(id)
			.snapshotChanges()
			.pipe(
				tap((v) => console.log(`project[${id}] snapshotChange:`, v)),
				map((value) =>
					value.type === 'removed'
						? undefined
						: (value.payload.data() as IProjectSummary),
				),
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
			.get<IProjectFull>(`${getStoreUrl(projectRef.storeId)}/project-full`, {
				params: { id: projectRef.projectId },
			})
			.pipe(shareReplay(1));
		this.projects[projectRef.projectId] = $project;
		return $project;
	}

	public getSummary(projectRef: IProjectRef): Observable<IProjectSummary | undefined> {
		console.log('ProjectService.getSummary()', projectRef);
		if (projectRef.storeId === 'firestore') {
			return this.watchProjectSummary(projectRef)
				.pipe(
					take(1),
				);
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

	private getProjectSummaryRequest(
		projectRef: IProjectRef,
	): Observable<IProjectSummary> {
		if (!projectRef) {
			return throwError(() => 'target is a required parameter');
		}
		const { storeId, projectId } = projectRef;
		if (!storeId) {
			return throwError(() => 'target.storeId is a required parameter');
		}
		console.log('getProjectSummaryRequest', storeId, projectId);
		if (
			storeId === STORE_ID_GITHUB_COM ||
			storeId === STORE_TYPE_GITHUB ||
			storeId.startsWith(GITLAB_REPO_PREFIX)
		) {
			const storeService =
				this.datatugStoreServiceFactory.getDatatugStoreService(storeId);
			return storeService.getProjectSummary(projectId);
		}
		const agentUrl = getStoreUrl(storeId);
		return this.http.get<IProjectSummary>(`${agentUrl}/project-summary`, {
			params: { id: projectId },
		});
	}

	public createNewProject(
		storeId: string,
		projData: ICreateProjectData,
	): Observable<string> {
		console.log('createNewProject', storeId, projData);
		const sneatApiService =
			this.sneatApiServiceFactory.getSneatApiService(storeId);
		return sneatApiService
			.post<ICreateProjectData, { id: string }>(
				'/datatug/projects/create_project?store=firestore',
				projData,
			)
			.pipe(map((response) => response.id));
	}
}

export interface ICreateProjectData {
	title: string;
	userIDs: string[];
	teamId?: string;
}

export interface ICreateProjectItemRequest {
	title: string;
	folder: '~' | string;
}
