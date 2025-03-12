import { Injectable, NgModule } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';

@Injectable()
export class TrackusApiService {
	constructor(private readonly sneatApiSerivce: SneatApiService) {}

	public addTrackerEntry(
		request: IAddTrackerEntryRequest,
	): Observable<IAddTrackerEntryResponse> {
		return this.sneatApiSerivce.post('trackus/add_tracker_entry', request);
	}

	public deleteTrackerEntry(
		request: IDeleteTrackerEntryRequest,
	): Observable<void> {
		return this.sneatApiSerivce.post('trackus/delete_tracker_entry', request);
	}
}

export interface IAddTrackerEntryRequest {
	spaceID: string;
	trackerID: string;
	value: unknown;
}

export interface IDeleteTrackerEntryRequest {
	spaceID: string;
	trackerID: string;
	created: string;
}

export interface IAddTrackerEntryResponse {
	entryID: string;
}

@NgModule({
	providers: [TrackusApiService],
})
export class TrackusApiServiceModule {}
