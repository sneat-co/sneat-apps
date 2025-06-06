import { Injectable, inject } from '@angular/core';
import { AssetService } from './services';
import { SpaceComponentBaseParams } from '@sneat/space-components';

@Injectable()
export class AssetComponentBaseParams {
	readonly spaceParams = inject(SpaceComponentBaseParams);
	readonly assetService = inject(AssetService);
}
