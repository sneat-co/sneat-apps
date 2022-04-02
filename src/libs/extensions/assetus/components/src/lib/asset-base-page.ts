import { Injectable } from '@angular/core';
import { TeamBasePage, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';

@Injectable()
export class AssetComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
	) {
	}
}

export abstract class AssetBasePage extends TeamBasePage {
	private assetContext?: IAssetContext;

	protected constructor(
		className: string,
		assetComponentParams: AssetComponentBaseParams,
	) {
		super(className, assetComponentParams.teamParams);
	}

	public get asset() {
		return this.assetContext;
	}
}
