import { Injectable } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { HappeningService } from '../services/happening.service';

@Injectable()
export class HappeningComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly happeningService: HappeningService,
	) {
	}
}

