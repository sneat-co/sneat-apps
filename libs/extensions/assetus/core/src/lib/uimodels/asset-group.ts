import { IAssetDtoGroupCounts, IAssetGroupContext } from '../dto';
import { Totals } from '@sneat/team-models';

export class AssetGroup {
	public readonly totals: Totals;

	constructor(public readonly context: IAssetGroupContext) {
		this.totals = new Totals(context.dto?.totals);
	}

	get id(): string {
		return this.context.id;
	}

	public get numberOf(): IAssetDtoGroupCounts {
		return this.context.dto?.numberOf || {};
	}
}
