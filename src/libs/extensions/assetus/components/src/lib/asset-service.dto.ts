import { IAssetMain, IDwelling, IVehicle } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface ICreateAssetRequest extends ITeamRequest, IAssetMain {
	readonly dwelling?: IDwelling;
	readonly vehicle?: IVehicle;
}
