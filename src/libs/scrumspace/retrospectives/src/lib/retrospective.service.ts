import { Injectable } from '@angular/core';
import { IRetroItem, IRetrospective, RetroItemType } from '@sneat/scrumspace/scrummodels';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseMeetingService, IMeetingRequest } from '@sneat/meeting';
import { SneatApiService } from '@sneat/api';
import { IRecord } from '@sneat/data';

export type IRetrospectiveRequest = IMeetingRequest;

export interface IRetroItemRequest extends IRetrospectiveRequest {
	item: string;
	type: RetroItemType;
}

export interface IVoteRetroItemRequest extends IRetroItemRequest {
	points: number;
}

export interface IStartRetrospectiveRequest extends IRetrospectiveRequest {
	durationInMinutes: {
		feedback: number;
		review: number;
	};
}

export interface IAddRetroItemRequest extends IRetrospectiveRequest {
	type: string;
	title: string;
}

export interface IAddRetroItemResponse {
	id: string;
}

@Injectable({
	providedIn: 'root',
})
export class RetrospectiveService extends BaseMeetingService {
	constructor(
		sneatApiService: SneatApiService,
		private readonly db: AngularFirestore,
	) {
		super('retrospective', sneatApiService);
	}

	public startRetrospective(
		request: IStartRetrospectiveRequest,
	): Observable<IRecord<IRetrospective>> {
		return this.sneatApiService.post(
			'retrospective/start_retrospective',
			request,
		);
	}

	public startRetroReview(
		request: IRetrospectiveRequest,
	): Observable<IRecord<IRetrospective>> {
		return this.sneatApiService.post(
			'retrospective/start_retro_review',
			request,
		);
	}

	addRetroItem(
		request: IAddRetroItemRequest,
	): Observable<IAddRetroItemResponse> {
		return this.sneatApiService.post(
			'retrospective/add_retro_item',
			request,
		);
	}

	public deleteRetroItem(request: IRetroItemRequest): Observable<IRetroItem[]> {
		return this.sneatApiService.post(
			'retrospective/delete_retro_item',
			request,
		);
	}

	public watchRetro(
		teamId: string,
		meetingId: string,
	): Observable<IRetrospective> {
		console.log(`watchRetro(${teamId}, ${meetingId})`);
		const retroDoc = this.db
			.collection('teams')
			.doc(teamId)
			.collection('retrospectives')
			.doc(meetingId);
		return retroDoc.snapshotChanges().pipe(
			tap((changes) => {
				console.log('retrospective changes:', changes);
			}),
			filter((changes) => changes.type === 'value'),
			map((changes) => changes.payload.data() as IRetrospective),
		);
	}

	public voteItem(request: IVoteRetroItemRequest): Observable<void> {
		return this.sneatApiService.post('retrospective/vote_item', request);
	}
}
