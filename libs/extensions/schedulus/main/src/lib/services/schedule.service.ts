import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
export class ScheduleService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatApiService: SneatApiService,
	) {}
}
