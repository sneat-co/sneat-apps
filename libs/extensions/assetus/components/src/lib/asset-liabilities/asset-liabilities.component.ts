import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	AlertController,
	IonicModule,
	ModalController,
	PopoverController,
} from '@ionic/angular';
import { ISelectItem, MultiSelectorComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	AssetCategory,
	DtoLiability,
	DtoServiceType,
	IAssetDtoBase,
	LiabilityServiceType,
} from '@sneat/mod-assetus-core';
import { Observable } from 'rxjs';
import { AssetService } from '../services';

interface AssetLiabilitiesByServiceType {
	type: LiabilityServiceType;
	title: string;
	liabilities?: DtoLiability[];
}

interface IServiceTypeService {
	serviceTypesByAssetCategory(
		a: unknown,
		category: AssetCategory,
	): Observable<{ values: DtoServiceType[] }>;
}

interface ILiabilityService {
	getByAssetId(
		assetId: string,
	): Observable<{ values: { serviceTypes: LiabilityServiceType[] }[] }>;
}

@Component({
	selector: 'sneat-asset-liabilities',
	templateUrl: './asset-liabilities.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class AssetLiabilitiesComponent {
	assetDto: IAssetDtoBase | undefined;

	@Input() addTitle?: string;

	@Input() liabilityType?: 'service' | 'tax';

	serviceTypes?: DtoServiceType[];

	liabilitiesByServiceType?: AssetLiabilitiesByServiceType[];

	@Output() serviceAdded = new EventEmitter<{ type: LiabilityServiceType }>();

	@Input() set asset(v: IAssetDtoBase | undefined) {
		this.assetDto = v;
		if (this.liabilityType) {
			this.load();
		}
	}

	handleError = (err: unknown): void => console.log(err);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly assetService: AssetService,
		private readonly liabilityService: ILiabilityService,
		private readonly alertCtrl: AlertController,
		private readonly modalCtrl: ModalController,
		private readonly popoverCtrl: PopoverController,
		private readonly serviceTypeService: IServiceTypeService,
	) {}

	load(): void {
		if (!this.assetDto) {
			return;
		}
		const { assetDto } = this;

		if (!assetDto) {
			throw new Error('!assetDto');
		}

		if (assetDto.category) {
			this.serviceTypeService
				.serviceTypesByAssetCategory(undefined, assetDto.category)
				.subscribe((result) => {
					this.serviceTypes = result.values;
					this.liabilitiesByServiceType = this.serviceTypes
						.filter((v) => v.serviceCategoryId === this.liabilityType)
						.map((v) => ({
							type: v.id as LiabilityServiceType,
							title: v.title || (v.id as string),
						}));
					if (
						assetDto.notUsedServiceTypes &&
						assetDto.notUsedServiceTypes.length
					) {
						this.liabilitiesByServiceType =
							this.liabilitiesByServiceType.filter(
								(l) =>
									!(
										assetDto.notUsedServiceTypes &&
										assetDto.notUsedServiceTypes.includes(l.type) &&
										(!l.liabilities || l.liabilities.length)
									),
							);
					}

					if (this.assetDto && this.assetDto.id) {
						this.liabilityService
							.getByAssetId(this.assetDto.id)
							.subscribe((selectResult) => {
								const liabilities = selectResult.values;
								console.log('liabilities:', liabilities);
								this.liabilitiesByServiceType =
									this.liabilitiesByServiceType?.filter(
										(service) =>
											!liabilities.some(
												(l) =>
													!!l.serviceTypes &&
													l.serviceTypes.includes(service.type),
											),
									);
							});
					}
				});
		}
	}

	trackByServiceType(
		i: number,
		service: AssetLiabilitiesByServiceType,
	): LiabilityServiceType {
		return service.type;
	}

	markAsNotUsed(service: AssetLiabilitiesByServiceType): void {
		this.alertCtrl
			.create({
				header: this.assetDto && this.assetDto.title,
				message: `Are you not using ${service.title}?`,
				buttons: [
					{
						text: 'Yes, remove it',
						handler: () => {
							this.hideService(service);
						},
					},
					'Cancel',
				],
			})
			.then((alert) => {
				alert.present().catch((err) => {
					this.errorLogger.logError(err, 'Failed to present alert');
				});
			})
			.catch((err) => {
				this.errorLogger.logError(err, 'Failed to create alert');
			});
	}

	hideService(service: AssetLiabilitiesByServiceType): void {
		if (!this.assetDto) {
			throw new Error('!this.assetDto');
		}
		if (!this.assetDto.id) {
			throw new Error('!this.assetDto.id');
		}
		throw new Error('not implemented yet, serviceType=' + service);
		/*
		this.assetService
			.updateAsset(undefined, this.assetDto.id, (dto) => {
				let changed = false;
				if (!dto.notUsedServiceTypes) {
					dto.notUsedServiceTypes = [];
				}
				if (!dto.notUsedServiceTypes.includes(service.type)) {
					dto.notUsedServiceTypes.push(service.type);
					changed = true;
				}
				return { dto, changed };
			})
			.subscribe(
				(dto) => {
					this.asset = dto;
				},
				(err) => {
					this.errorLogger.logError(err, 'Failed to update asset record');
				},
			);
			*/
	}

	async addService(type?: LiabilityServiceType): Promise<void> {
		console.log(`addService(${type})`);
		if (type) {
			this.serviceAdded.emit({ type });
		} else {
			try {
				const items: ISelectItem[] =
					this.serviceTypes?.map((v) => ({
						id: v.id || '',
						title: v.title || (v.id as string),
					})) || [];
				const modal = await this.popoverCtrl.create({
					component: MultiSelectorComponent,
					componentProps: {
						title: this.addTitle,
						items,
						onSelect: (item: ISelectItem) => {
							this.serviceAdded.emit({
								type: item.id as LiabilityServiceType,
							});
						},
					},
				});
				modal
					.onDidDismiss()
					.then((result) => {
						if (result.role === 'select') {
							console.log('selected:', result);
							this.serviceAdded.emit({
								type: result.data.item.value as LiabilityServiceType,
							});
						}
					})
					.catch(this.handleError);
				await modal.present();
			} catch (e) {
				this.handleError(e);
			}
		}
	}
}
