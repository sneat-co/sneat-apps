import { Inject, Injectable } from '@angular/core';
import { IMemberBrief, ITeamDto } from '@sneat/dto';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import {
	AngularFirestore,
	AngularFirestoreCollection,
	AngularFirestoreDocument,
	DocumentReference,
} from '@angular/fire/compat/firestore';
import { filter, map, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { BaseMeetingService } from '@sneat/meeting';
import { IRecord } from '@sneat/data';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import {
	IAddCommentRequest,
	IAddTaskRequest,
	IReorderTaskRequest,
	IScrumDto, IScrumStatusMember,
	IStatus,
	ITask,
	IThumbUpRequest,
	TaskType,
} from '@sneat/scrumspace/scrummodels';
import { RandomIdService } from '@sneat/random';
import { SneatUserService } from '@sneat/user';
import firebase from 'firebase/compat/app';
import FieldPath = firebase.firestore.FieldPath;

const getOrCreateMemberStatus = (
	scrum: IScrumDto,
	member: IMemberBrief,
): IStatus => {
	const mid = member.id;
	const statusOfMember = (item: IStatus) => mid && item.member.id === mid;
	let status = scrum.statuses.find(statusOfMember);
	if (!status) {
		status = {
			member: member as IScrumStatusMember,
			byType: {
				done: [],
				risk: [],
				todo: [],
				qna: [],
			},
		};
		scrum.statuses.push(status);
	}
	return status;
};

export interface ITaskWithUiStatus extends ITask {
	uiStatus?: 'adding' | 'deleting';
}

@Injectable({
	providedIn: 'root',
})
export class ScrumService extends BaseMeetingService {
	constructor(
		override readonly sneatApiService: SneatApiService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly randomIdService: RandomIdService,
		private readonly userService: SneatUserService,
		private readonly db: AngularFirestore,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
	) {
		super('scrum', sneatApiService);
	}

	public getScrums(teamId: string, limit = 10): Observable<IRecord<IScrumDto>[]> {
		console.log('getScrums()', teamId, limit, this.userService.currentUserId);
		const scrums = this.scrumsCollection(teamId);
		const query = scrums.ref
			.where('userIDs', 'array-contains', this.userService.currentUserId)
			.orderBy(FieldPath.documentId(), 'desc')
			.limit(limit);
		return from(query.get()).pipe(
			map((result) => {
				console.log('result', result);
				// TODO: Remove `@ts-ignore`
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				return result.docs.map((d) => {
					console.log('d', d);
					return {
						id: d.id,
						dto: d.data() as IScrumDto,
					};
				});
			}),
		);
	}

	public watchScrum(teamId: string, scrumId: string): Observable<IScrumDto> {
		console.log(`watchScrum(${teamId}, ${scrumId})`);
		const scrumDoc = this.getScrumDoc(teamId, scrumId);
		return scrumDoc.snapshotChanges().pipe(
			tap((changes) => {
				console.log('scrum changes:', changes);
			}),
			filter((changes) => changes.type === 'value'),
			map((changes) => changes.payload.data() as IScrumDto),
		);
	}

	public deleteTask(
		team: string,
		scrumId: string,
		member: IMemberBrief,
		type: TaskType,
		id: string,
	): Observable<void> {
		console.log('deleteTask', team, scrumId, member, type, id);
		const params = new HttpParams()
			.append('team', team)
			.append('date', scrumId)
			.append('member', member.id)
			.append('type', type)
			.append('id', id);

		return this.sneatApiService.delete<void>('scrum/delete_task', params);
	}

	public reorderTask(request: IReorderTaskRequest): Observable<void> {
		console.log('reorderTask', request);
		return this.sneatApiService.post<void>('scrum/reorder_task', request);
	}

	public thumbUp(request: IThumbUpRequest): Observable<void> {
		console.log('thumbUp', request);
		return this.sneatApiService.post<void>('scrum/thumb_up_task', request);
	}

	public addComment(request: IAddCommentRequest): Observable<string> {
		console.log('addComment', request);
		if (!request.message) {
			return throwError(() => 'message required');
		}
		if (!request.teamID) {
			return throwError(() => 'team required');
		}
		if (!request.member) {
			return throwError(() => 'member required');
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (!request.meeting) {
			return throwError(() => 'meeting required');
		}
		if (!request.type) {
			return throwError(() => 'task type required');
		}
		return this.sneatApiService.post<string>('scrum/add_comment', request);
	}

	public setTaskCompletion(
		teamId: string,
		scrumId: string,
		member: IMemberBrief,
		taskId: string,
		isCompleted: boolean,
	): Observable<IStatus> {
		let memberStatus: IStatus;
		return this.updateStatus(teamId, scrumId, member, (scrum, status) => {
			const move = (src: 'done' | 'todo', dst: 'done' | 'todo'): void => {
				memberStatus = status;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const index = status[src].findIndex((t) => t.id === taskId);
				if (index >= 0) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					status[dst] = status[dst].filter((t) => t.id !== taskId);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					status[dst].push(status[src][index]);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					status[src].splice(index, 1);
				}
			};
			if (isCompleted) {
				move('todo', 'done');
			} else {
				move('done', 'todo');
			}
			return scrum;
		}).pipe(
			tap(() => {
				const eventParams: any = { teamId, id: taskId };
				if (member.id) {
					eventParams.memberId = member.id;
				} else if (member.uid) {
					eventParams.memberUid = member.uid;
				}
				this.analyticsService.logEvent('taskCompletionChanged', eventParams);
			}),
			map(() => memberStatus),
		);
	}

	public addTask(
		team: IRecord<ITeamDto>,
		scrumId: string,
		member: IMemberBrief,
		type: TaskType,
		title: string,
	): Observable<ITaskWithUiStatus> {
		const task: ITaskWithUiStatus = {
			id: this.randomIdService.newRandomId({ len: 9 }),
			title,
			uiStatus: 'adding',
		};
		const request: IAddTaskRequest = {
			type,
			teamID: team.id,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			meeting: scrumId,
			member: member.id,
			task: task.id,
			title: task.title,
		};
		const subj = new BehaviorSubject(task);
		this.sneatApiService.post('scrum/add_task', request).subscribe({
			next: () => {
				subj.next({ ...task, uiStatus: undefined });
				subj.complete();
			},
			error: subj.error,
		});
		return subj;
	}

	private getScrumRef(teamId: string, scrumId: string): DocumentReference {
		return this.getScrumDoc(teamId, scrumId).ref;
	}

	private scrumsCollection(teamId: string): AngularFirestoreCollection<IScrumDto> {
		const teamDoc = this.db.collection('teams').doc<ITeamDto>(teamId);
		return teamDoc.collection<IScrumDto>('scrums');
	}

	private getScrumDoc(
		teamId: string,
		scrumId: string,
	): AngularFirestoreDocument<IScrumDto> {
		return this.scrumsCollection(teamId).doc(scrumId);
	}

	private updateStatus(
		teamId: string,
		scrumId: string,
		member: IMemberBrief,
		// TODO: Invalid eslint-disable-next-line no-shadow - lambda definition should not cause shadowing.
		// https://github.com/sneat-team/sneat-team-pwa/issues/381
		// eslint-disable-next-line no-shadow
		worker: (scrum: IScrumDto, status: IStatus) => IScrumDto,
	): Observable<IScrumDto> {
		let scrum: IScrumDto;
		return from(
			this.db.firestore.runTransaction((transaction) => {
				const scrumRef = this.getScrumRef(teamId, scrumId);
				return transaction.get(scrumRef).then((scrumDoc) => {
					scrum = scrumDoc.data() as IScrumDto;
					const status = getOrCreateMemberStatus(scrum, member);
					scrum = worker(scrum, status);
					return transaction.update(scrumRef, { statuses: scrum.statuses });
				});
			}),
		).pipe(map(() => scrum));
	}
}
