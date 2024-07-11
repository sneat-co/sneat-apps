import { ISpaceItemNavContext } from '@sneat/team-models';
import { AssetExtraType, IAssetBrief, IAssetDbo, IAssetExtra } from '../dto';

export type IAssetContext<
	ExtraType extends AssetExtraType = string,
	Extra extends IAssetExtra = IAssetExtra,
> = ISpaceItemNavContext<
	IAssetBrief<ExtraType, Extra>,
	IAssetDbo<ExtraType, Extra>
>;
