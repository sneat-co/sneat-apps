import { Injectable, NgModule } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';

@Injectable()
export class TrackusApiService {
	constructor(private readonly sneatApiService: SneatApiService) {}

	public createTracker(
		request: ICreateTrackerRequest,
	): Observable<ICreateTrackerResponse> {
		return this.sneatApiService.post('trackus/create_tracker', request);
	}

	public archiveTracker(request: ITrackerRequest): Observable<void> {
		return this.sneatApiService.post('trackus/archive_tracker', request);
	}

	public addTrackerEntry(
		request: IAddTrackerEntryRequest,
	): Observable<IAddTrackerEntryResponse> {
		return this.sneatApiService.post('trackus/add_tracker_entry', request);
	}

	public deleteTrackerEntry(
		request: IDeleteTrackerEntryRequest,
	): Observable<void> {
		return this.sneatApiService.post('trackus/delete_tracker_entry', request);
	}
}

export interface ITrackerRequest {
	spaceID: string;
	trackerID: string;
}

export interface ICreateTrackerRequest {
	spaceID: string;
}

export interface IAddTrackerEntryRequest {
	spaceID: string;
	trackerID: string;
	value: unknown;
}

export interface IDeleteTrackerEntryRequest {
	spaceID: string;
	trackerID: string;
	timeStamp: string;
}

export interface IAddTrackerEntryResponse {
	entryID: string;
}

export interface ICreateTrackerResponse {
	trackerID: string;
}

@NgModule({
	providers: [TrackusApiService],
})
export class TrackusApiServiceModule {}
