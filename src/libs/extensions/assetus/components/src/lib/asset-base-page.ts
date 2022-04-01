import { TeamBasePage, TeamComponentBaseParams } from '@sneat/team/components';

export class AssetComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
	) {
	}
}

export abstract class AssetBasePage extends TeamBasePage {
	protected constructor(
		className: string,
		assetComponentParams: AssetComponentBaseParams,
	){
		super(className, assetComponentParams.teamParams)
	}
}
