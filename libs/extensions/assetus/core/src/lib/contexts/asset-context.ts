import { ITeamItemNavContext } from '@sneat/team-models';
import { AssetExtraType, IAssetBrief, IAssetDbo, IAssetExtra } from '../dto';

export type IAssetContext<
	ExtraType extends AssetExtraType = string,
	Extra extends IAssetExtra<ExtraType> = IAssetExtra<ExtraType>,
> = ITeamItemNavContext<IAssetBrief, IAssetDbo<ExtraType, Extra>>;
