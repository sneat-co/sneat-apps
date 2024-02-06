import { CommuneBasePage } from 'sneat-shared/pages/commune-base-page';
import { Asset } from 'sneat-shared/models/ui/ui-asset';
import { IAssetDto, IVehicle } from 'sneat-shared/models/dto/dto-asset';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { IAssetService } from 'sneat-shared/services/interfaces';
import { first } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { CommuneTopPage } from '../../pages/constants';

export abstract class AssetBasePage extends CommuneBasePage implements OnInit {
	public asset: Asset | undefined;
	public vehicle: IVehicle;

	protected constructor(
		defaultBackPage:
			| 'real-estates'
			| CommuneTopPage.assets
			| CommuneTopPage.asset
			| CommuneTopPage.vehicles,
		params: CommuneBasePageParams,
		protected assetService: IAssetService,
	) {
		super(defaultBackPage, params);
	}

	ionViewDidEnter(): void {
		if (!location.href.includes('?') && this.asset) {
			history.replaceState(
				{
					communeDto: this.commune && this.commune.dto,
					assetDto: this.asset,
				},
				document.title,
				`${location.href}?asset=${this.asset.dto.id}`,
			);
		}
	}

	protected setAssetDto(assetDto?: IAssetDto): void {
		if (!assetDto) {
			this.asset = undefined;
			return;
		}
		this.asset = new Asset(assetDto);
		if (this.asset.dto.categoryId === 'vehicles') {
			this.vehicle = this.asset.dto as IVehicle;
		}
		if (
			assetDto.communeId &&
			this.communeRealId &&
			assetDto.communeId !== this.communeRealId
		) {
			throw new Error('Temporary commented out');
			// this.setPageCommuneIds('AssetPage.assetFromObservable', {real: assetDto.communeId});
		}
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.setAssetDto(history.state.assetDto as IAssetDto);
		this.route.queryParamMap.pipe(first()).subscribe((params) => {
			const assetId =
				params.get('id') ||
				params.get('asset') ||
				(this.asset && this.asset.dto.id);
			if (!assetId) {
				throw new Error('!assetId');
			}
			this.assetService.watchById(assetId).subscribe((asset) => {
				console.log(
					`AssetPage.assetService.watchItemById(${assetId}) =>`,
					asset,
				);
				this.setAssetDto(asset);
			});
		});
	}
}
