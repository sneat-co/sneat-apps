//tslint:disable:no-unbound-method
//tslint:disable:no-unsafe-any
import { Component, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';
import { AssetService } from '../../services/asset-service';
import { ICreateAssetRequest } from '../../services/asset-service.dto';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-dwelling',
	templateUrl: './asset-add-dwelling-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class AssetAddDwellingPageComponent extends AddAssetBaseComponent {

	@Input({ required: true }) team?: ITeamContext;

	form = new UntypedFormGroup({
		address: new FormControl<string>(''),
		ownership: new FormControl<string>('', Validators.required),
	});


	constructor(
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		super(teamParams, assetService);
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
		if (!this.team?.id) {
			throw new Error('can not create asset without team context');
		}

		const request: ICreateAssetRequest = {
			teamID: this.team?.id,
			category: 'real_estate',
			title: this.titleForm.controls['title'].value,
			// address: this.form.controls['address'].value,
		};
		// switch (this.form.controls['ownership'].value) {
		// 	case 'landlord':
		// 		request.rent = 'landlord';
		// 		break;
		// 	case 'tenant':
		// 		request.rent = 'tenant';
		// 		break;
		// 	default:
		// 		break;
		// }
		this.assetService.createAsset(this.team, request)
			.subscribe({
				next: dto => {
					console.log('AssetAddDwellingPageComponent.submitDwellingForm(): created asset', dto);
					// this.navigateForward('asset', { id: dto.id }, { assetDto: request }, {
					// 	excludeCommuneId: true,
					// 	replaceUrl: true,
					// });
				},
				error: err => {
					this.isSubmitting = false;
					alert(err);
				}
			});
	}
}
