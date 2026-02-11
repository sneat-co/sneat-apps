import { INavContext } from '@sneat/core';
import { ISpaceItemNavContext } from '@sneat/space-models';
import {
  AssetExtraType,
  IAssetBrief,
  IAssetDbo,
  IAssetDtoGroup,
  IAssetDwellingExtra,
  IAssetExtra,
  IAssetVehicleExtra,
} from '../dto/dto-asset';

export type IAssetContext<
  ExtraType extends AssetExtraType = string,
  Extra extends IAssetExtra = IAssetExtra,
> = ISpaceItemNavContext<
  IAssetBrief<ExtraType, Extra>,
  IAssetDbo<ExtraType, Extra>
>;

export type IAssetVehicleContext = IAssetContext<'vehicle', IAssetVehicleExtra>;
export type IAssetDwellingContext = IAssetContext<
  'dwelling',
  IAssetDwellingExtra
>;

export type IAssetGroupContext = INavContext<IAssetDtoGroup, IAssetDtoGroup>;
