import { ITeamItemNavContext } from '@sneat/team-models';
import {
	IAssetBrief,
	IAssetDtoBase,
	IDocumentAssetDto,
	IDocumentBrief,
	IVehicleAssetDto,
} from '../dto';

export type IAssetContext<Dto extends IAssetDtoBase = IAssetDtoBase> =
	ITeamItemNavContext<IAssetBrief, Dto>;
export type IVehicleAssetContext = IAssetContext<IVehicleAssetDto>;
export type IDocumentAssetContext = ITeamItemNavContext<
	IDocumentBrief,
	IDocumentAssetDto
>;
