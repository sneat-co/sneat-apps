import { Injectable } from '@angular/core';
import { AssetService } from './services/asset-service';
import { TeamComponentBaseParams } from '@sneat/team/components';

@Injectable()
export class AssetComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly assetService: AssetService,
	) {}
}
