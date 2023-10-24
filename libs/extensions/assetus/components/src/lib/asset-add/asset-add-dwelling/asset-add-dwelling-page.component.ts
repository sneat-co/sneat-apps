import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorComponent } from '@sneat/components';
import { AssetCategory, IAssetMainData } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { AssetService } from '../../services/asset-service';
import { ICreateAssetRequest } from '../../services/asset-service.dto';
import { AddAssetBaseComponent } from '../add-asset-base-component';

@Component({
	selector: 'sneat-asset-add-dwelling',
	templateUrl: './asset-add-dwelling-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		CountrySelectorComponent,
	],
	providers: [TeamComponentBaseParams],
	...AddAssetBaseComponent.metadata,
})
export class AssetAddDwellingPageComponent extends AddAssetBaseComponent {
	form = new UntypedFormGroup({
		address: new FormControl<string>(''),
		ownership: new FormControl<string>('', Validators.required),
	});

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		assetService: AssetService,
	) {
		super('AssetAddDwellingPageComponent', route, teamParams, assetService);
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

		const request: ICreateAssetRequest<IAssetMainData> = {
			teamID: this.team?.id,
			asset: {
				status: 'active',
				possession: 'undisclosed',
				category: 'dwelling' as AssetCategory,
				title: this.titleForm.controls['title'].value,
				// address: this.form.controls['address'].value,
			},
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
		this.assetService.createAsset(this.team, request).subscribe({
			next: (dto) => {
				console.log(
					'AssetAddDwellingPageComponent.submitDwellingForm(): created asset',
					dto,
				);
				// this.navigateForward('asset', { id: dto.id }, { assetDto: request }, {
				// 	excludeCommuneId: true,
				// 	replaceUrl: true,
				// });
			},
			error: (err) => {
				this.isSubmitting = false;
				alert(err);
			},
		});
	}
}
