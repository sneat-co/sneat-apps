import { Injectable } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { ListService } from './services/list.service';

@Injectable()
export class ListusComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly listService: ListService,
	) {}
}
