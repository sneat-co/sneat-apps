import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { IHappeningDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Observable } from 'rxjs';

export interface ICreateHappeningRequest {
	teamID: string;
	dto: IHappeningDto;
}


@Injectable()
export class ScheduleService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatApiService: SneatApiService,
	) {
	}
}
