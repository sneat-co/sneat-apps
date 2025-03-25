import { IAssetGroupContext } from '../contexts/asset-context';
import { IAssetDtoGroupCounts } from '../dto/';
import { Totals } from '@sneat/space-models';

export class AssetGroup {
	public readonly totals: Totals;

	constructor(public readonly context: IAssetGroupContext) {
		this.totals = new Totals(context.dbo?.totals);
	}

	get id(): string {
		return this.context.id;
	}

	public get numberOf(): IAssetDtoGroupCounts {
		return this.context.dbo?.numberOf || {};
	}
}
