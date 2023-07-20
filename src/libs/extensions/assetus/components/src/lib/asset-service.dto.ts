import { IAssetMain, IVehicleData } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface ICreateAssetRequestBase extends ITeamRequest, IAssetMain {
	// readonly dwelling?: IDwelling;
	// readonly vehicle?: IVehicleData;
}

export interface ICreateVehicleAssetRequest
	extends ICreateAssetRequestBase, IVehicleData {
}
