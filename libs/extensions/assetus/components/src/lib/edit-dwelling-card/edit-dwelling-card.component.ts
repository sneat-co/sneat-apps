import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	CountrySelectorComponent,
	SelectFromListModule,
} from '@sneat/components';
import { IAssetContext, IAssetDwellingContext } from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/team-models';
import { AssetPossessionCardComponent } from '../asset-possesion-card/asset-possession-card.component';

@Component({
	selector: 'sneat-edit-dwelling-card',
	templateUrl: './edit-dwelling-card.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		SelectFromListModule,
		CountrySelectorComponent,
		AssetPossessionCardComponent,
	],
})
export class AddDwellingCardComponent implements OnChanges {
	@Input({ required: true }) team?: ISpaceContext;

	@Input({ required: true }) dwellingAsset?: IAssetDwellingContext;
	@Output() readonly dwellingAssetChange = new EventEmitter<IAssetContext>();

	protected title = '';
	protected address = '';
	protected rent_price_amount?: number;
	protected rent_price_currency = 'USD';
	protected number_of_bedrooms?: number;
	protected areaSqM?: number;

	ngOnChanges(changes: SimpleChanges): void {
		if (
			changes['team'] &&
			this.team?.dbo?.countryID &&
			this.dwellingAsset?.dbo &&
			!this.dwellingAsset.dbo.countryID
		) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: { ...this.dwellingAsset.dbo, countryID: this.team.dbo.countryID },
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}

		if (changes['dwellingAsset']) {
			this.title = this.dwellingAsset?.dbo?.title || '';
			this.address = this.dwellingAsset?.dbo?.extra?.address?.lines || '';
			this.rent_price_amount =
				this.dwellingAsset?.dbo?.extra?.rent_price?.value;
			this.rent_price_currency =
				this.dwellingAsset?.dbo?.extra?.rent_price?.currency || 'USD';
			this.number_of_bedrooms =
				this.dwellingAsset?.dbo?.extra?.numberOfBedrooms;
			this.areaSqM = this.dwellingAsset?.dbo?.extra?.areaSqM;
		}
	}

	protected onBriefFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dbo) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: {
					...this.dwellingAsset.dbo,
					[field]: value,
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onExtraFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dbo && this.dwellingAsset?.dbo?.extra) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: {
					...this.dwellingAsset.dbo,
					extra: {
						...this.dwellingAsset.dbo.extra,
						[field]: value,
					},
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onRentPriceFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dbo?.extra?.rent_price) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: {
					...this.dwellingAsset.dbo,
					extra: {
						...this.dwellingAsset.dbo.extra,
						rent_price: {
							...this.dwellingAsset.dbo.extra.rent_price,
							[field]: value,
						},
					},
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onCountryChanged(value: string): void {
		console.log('countryChanged', value, this.dwellingAsset?.dbo);
		if (this.dwellingAsset?.dbo) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dbo: { ...this.dwellingAsset.dbo, countryID: value },
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onAssetChanged(asset: IAssetContext): void {
		console.log(asset.dbo);
		this.dwellingAsset = asset as IAssetDwellingContext;
		this.dwellingAssetChange.emit(this.dwellingAsset);
	}
}
