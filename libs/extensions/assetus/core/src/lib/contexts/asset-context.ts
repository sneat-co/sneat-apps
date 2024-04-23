import { ITeamItemNavContext } from '@sneat/team-models';
import { IAssetBrief, IAssetDbo, IAssetExtra } from '../dto';

export type IAssetContext<Extra extends IAssetExtra = IAssetExtra> =
	ITeamItemNavContext<IAssetBrief, IAssetDbo<Extra>>;
