import { Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { excludeUndefined } from '@sneat/core';
import { IName } from '@sneat/dto';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserRecordService {
	constructor(
		private readonly sneatApiService: SneatApiService,
	) {
	}

	public setUserNames(names: ISetNamesRequest): Observable<void> {
		console.log(`setUserTitle()`, names);
		names = excludeUndefined(names);
		// throw new Error('not implemented yet'); // due to circle deps
		return this.sneatApiService.post<void>('users/set_user_names', names);
	}

}

export interface ISetNamesRequest {
	name: IName;
	email: string;
	ianaTimezone: string;
}
