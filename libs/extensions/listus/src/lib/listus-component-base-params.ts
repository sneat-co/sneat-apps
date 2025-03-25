import { Injectable } from '@angular/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { ListService } from './services/list.service';

@Injectable()
export class ListusComponentBaseParams {
	constructor(
		public readonly spaceParams: SpaceComponentBaseParams,
		public readonly listService: ListService,
	) {}
}
