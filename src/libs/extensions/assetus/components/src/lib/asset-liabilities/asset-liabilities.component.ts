//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { LiabilityServiceType } from 'sneat-shared/models/types';
import { DtoLiability } from 'sneat-shared/models/dto/dto-liability';
import { IAssetDto } from 'sneat-shared/models/dto/dto-asset';
import { DtoServiceType } from 'sneat-shared/models/dto/dto-service-provider';
import { IAssetService, IErrorLogger, ILiabilityService, IServiceTypeService } from 'sneat-shared/services/interfaces';
import { ModalSelectorItem } from 'sneat-shared/components/modals/modal-selector/modal-selector-models';
import { ModalSelectorComponent } from 'sneat-shared/components/modals/modal-selector/modal-selector.component';

interface AssetLiabilitiesByServiceType {
	type: LiabilityServiceType;
	title: string;
	liabilities?: DtoLiability[];
}

@Component({
	selector: 'sneat-asset-liabilities',
	templateUrl: './asset-liabilities.component.html',
	// styleUrls: ['./asset-liabilities.component.scss'],
})
export class AssetLiabilitiesComponent {

	assetDto: IAssetDto | undefined;

	@Input() addTitle: string;

	@Input() liabilityType: 'service' | 'tax';

	serviceTypes: DtoServiceType[];

	liabilitiesByServiceType: AssetLiabilitiesByServiceType[];

	// tslint:disable-next-line:no-output-on-prefix // TODO: remove
	@Output() serviceAdded = new EventEmitter<{ type: LiabilityServiceType }>();

	@Input() set asset(v: IAssetDto | undefined) {
		this.assetDto = v;
		if (this.liabilityType) {
			this.load();
		}
	}

	handleError = (err: unknown): void => console.log(err);

	constructor(
		private readonly assetService: IAssetService,
		private readonly liabilityService: ILiabilityService,
		private readonly alertCtrl: AlertController,
		private readonly modalCtrl: ModalController,
		private readonly popoverCtrl: PopoverController,
		private readonly serviceTypeService: IServiceTypeService,
		private readonly errorLogger: IErrorLogger,
	) {
	}

	load(): void {
		if (!this.assetDto) {
			return;
		}
		// tslint:disable-next-line:no-this-assignment
		const { assetDto } = this;

		if (!assetDto) {
			throw new Error('!assetDto');
		}

		if (assetDto.categoryId) {
			this.serviceTypeService.serviceTypesByAssetCategory(undefined, assetDto.categoryId)
				.subscribe(result => {
					this.serviceTypes = result.values;
					this.liabilitiesByServiceType = this.serviceTypes
						.filter(v => v.serviceCategoryId === this.liabilityType)
						.map(v => ({ type: v.id as LiabilityServiceType, title: v.title || v.id as string }));
					if (assetDto.notUsedServiceTypes && assetDto.notUsedServiceTypes.length) {
						this.liabilitiesByServiceType = this.liabilitiesByServiceType.filter(l =>
							!(assetDto.notUsedServiceTypes && assetDto.notUsedServiceTypes.includes(l.type) && (!l.liabilities || l.liabilities.length)),
						);
					}

					if (this.assetDto && this.assetDto.id) {
						this.liabilityService.getByAssetId(this.assetDto.id)
							.subscribe(selectResult => {
								const liabilities = selectResult.values;
								console.log('liabilities:', liabilities);
								this.liabilitiesByServiceType = this.liabilitiesByServiceType.filter(
									service => !liabilities.some(l => !!l.serviceTypes && l.serviceTypes.includes(service.type)));
							});
					}
				});
		}
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackByServiceType(i: number, service: AssetLiabilitiesByServiceType): LiabilityServiceType {
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
			.then(alert => {
				alert
					.present()
					.catch(err => {
						this.errorLogger.logError(err, 'Failed to present alert');
					});
			})
			.catch(err => {
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
		this.assetService.updateRecord(undefined, this.assetDto.id, dto => {
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
				dto => {
					this.asset = dto;
				},
				err => {
					this.errorLogger.logError(err, 'Failed to update asset record');
				},
			);
	}

	async addService(type?: LiabilityServiceType): Promise<void> {
		console.log(`addService(${type})`);
		if (type) {
			this.serviceAdded.emit({ type });
		} else {
			try {
				const items: ModalSelectorItem[] = this.serviceTypes.map(v => ({
					value: v.id,
					label: v.title || v.id as string,
				}));
				const modal = await this.popoverCtrl.create({
					component: ModalSelectorComponent,
					componentProps: {
						title: this.addTitle,
						items,
						onSelect: (item: ModalSelectorItem) => {
							this.serviceAdded.emit({ type: item.value as LiabilityServiceType });
						},
					},
				});
				modal.onDidDismiss()
					.then(result => {
						if (result.role === 'select') {
							console.log('selected:', result);
							this.serviceAdded.emit({ type: result.data.item.value as LiabilityServiceType });
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
