import { Injectable, NgModule, inject } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';
import { ITrackerBrief } from './dbo/i-tracker-dbo';

@Injectable()
export class TrackusApiService {
	private readonly sneatApiService = inject(SneatApiService);

	public addTracker(
		request: ICreateTrackerRequest,
	): Observable<ICreateTrackerResponse> {
		return this.sneatApiService.post('trackus/add_tracker', request);
	}

	public createTracker(
		request: ICreateTrackerRequest,
	): Observable<ICreateTrackerResponse> {
		return this.sneatApiService.post('trackus/create_tracker', request);
	}

	public archiveTracker(request: ITrackerRequest): Observable<void> {
		return this.sneatApiService.post('trackus/archive_tracker', request);
	}

	public addTrackerPoint(
		request: IAddTrackerPointRequest,
	): Observable<IAddTrackerPointResponse> {
		return this.sneatApiService.post('trackus/add_tracker_point', request);
	}

	public deleteTrackerPoints(
		request: IDeleteTrackerPointsRequest,
	): Observable<void> {
		return this.sneatApiService.post('trackus/delete_tracker_points', request);
	}
}

export interface ITrackerRequest {
	spaceID: string;
	trackerID: string;
}

export interface ICreateTrackerRequest extends ITrackerBrief {
	readonly spaceID: string;
}

export interface IAddTrackerPointRequest {
	readonly spaceID: string;
	readonly trackerID: string;
	readonly trackByKind: 'space' | 'contact' | 'asset';
	readonly trackByID: string;
	readonly i?: number;
}

export interface IDeleteTrackerPointsRequest {
	readonly spaceID: string;
	readonly trackerID: string;
	readonly entityRef?: string;
	readonly date?: string;
	readonly pointIDs?: string[];
}

export interface IAddTrackerPointResponse {
	readonly entryID: string;
}

export interface ICreateTrackerResponse {
	trackerID: string;
}

@NgModule({
	providers: [TrackusApiService],
})
export class TrackusApiServiceModule {}
