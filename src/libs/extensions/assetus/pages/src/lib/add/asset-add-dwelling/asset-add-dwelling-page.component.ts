//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssetAddBasePage} from '../asset-add-base-page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IAssetService} from 'sneat-shared/services/interfaces';
import {IDwelling} from 'sneat-shared/models/dto/dto-asset';

@Component({
	selector: 'sneat-asset-add-dwelling',
	templateUrl: './asset-add-dwelling-page.component.html',
	providers: [CommuneBasePageParams],
})
export class AssetAddDwellingPageComponent extends AssetAddBasePage {

	form = new FormGroup({
		address: new FormControl(''),
		ownership: new FormControl('', Validators.required),
	});

	isSubmitting = false;

	constructor(
		private readonly assetService: IAssetService,
		params: CommuneBasePageParams,
	) {
		super('assets', params);
	}

	submitDwellingForm(): void {
		if (this.titleForm.invalid) {
			alert('Title is invalid');
			return;
		}
		if (this.form.invalid) {
			alert('Form is invalid');
			return;
		}

		const assetDto: IDwelling = {
			communeId: this.communeRealId,
			categoryId: 'real_estate',
			title: this.titleForm.controls.title.value,
			address: this.form.controls.address.value,
		};
		switch (this.form.controls.ownership.value) {
			case 'landlord':
				assetDto.rent = 'landlord';
				break;
			case 'tenant':
				assetDto.rent = 'tenant';
				break;
			default:
				break;
		}
		this.assetService.add(assetDto)
			.subscribe(
				dto => {
					this.navigateForward('asset', {id: dto.id}, {assetDto}, {excludeCommuneId: true, replaceUrl: true});
				},
				err => {
					this.isSubmitting = false;
					alert(err);
				});

	}
}
