import { IAssetDbData } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface ICreateAssetRequest extends ITeamRequest {
	readonly asset: IAssetDbData;
}
