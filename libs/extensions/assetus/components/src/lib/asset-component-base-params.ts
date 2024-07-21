import { Injectable } from '@angular/core';
import { AssetService } from './services';
import { SpaceComponentBaseParams } from '@sneat/team-components';

@Injectable()
export class AssetComponentBaseParams {
	constructor(
		public readonly spaceParams: SpaceComponentBaseParams,
		public readonly assetService: AssetService,
	) {}
}
