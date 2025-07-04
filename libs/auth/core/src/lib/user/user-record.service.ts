import { Injectable, inject } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { IPersonNames } from '@sneat/auth-models';
import { AgeGroupID, excludeUndefined, Gender, SpaceType } from '@sneat/core';
import { IUserDbo } from '@sneat/dto';
import { Observable, share } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserRecordService {
	private readonly sneatApiService = inject(SneatApiService);

	private initUserRecord$?: Observable<IUserDbo>;

	public initUserRecord(request: IInitUserRecordRequest): Observable<IUserDbo> {
		if (!request.ianaTimezone) {
			request = {
				...request,
				ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			};
		}
		console.log(`initUserRecord()`, request);
		request = excludeUndefined(request);
		this.initUserRecord$ = this.sneatApiService
			.post<IUserDbo>('users/init_user_record', request)
			.pipe(share());
		return this.initUserRecord$;
	}
}

export interface IInitUserRecordRequest {
	readonly authProvider?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly names?: IPersonNames;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly ianaTimezone?: string;
	readonly space?: { type: SpaceType; title: string };
}
