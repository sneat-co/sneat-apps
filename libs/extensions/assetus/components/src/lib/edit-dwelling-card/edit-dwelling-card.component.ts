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
import { ITeamContext } from '@sneat/team-models';
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
	@Input({ required: true }) team?: ITeamContext;

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
			this.team?.dto?.countryID &&
			this.dwellingAsset?.dto &&
			!this.dwellingAsset.dto.countryID
		) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: { ...this.dwellingAsset.dto, countryID: this.team.dto.countryID },
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}

		if (changes['dwellingAsset']) {
			this.title = this.dwellingAsset?.dto?.title || '';
			this.address = this.dwellingAsset?.dto?.extra?.address || '';
			this.rent_price_amount =
				this.dwellingAsset?.dto?.extra?.rent_price?.value;
			this.rent_price_currency =
				this.dwellingAsset?.dto?.extra?.rent_price?.currency || 'USD';
			this.number_of_bedrooms =
				this.dwellingAsset?.dto?.extra?.numberOfBedrooms;
			this.areaSqM = this.dwellingAsset?.dto?.extra?.areaSqM;
		}
	}

	protected onBriefFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dto) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: {
					...this.dwellingAsset.dto,
					[field]: value,
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onExtraFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dto && this.dwellingAsset?.dto?.extra) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: {
					...this.dwellingAsset.dto,
					extra: {
						...this.dwellingAsset.dto.extra,
						[field]: value,
					},
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onRentPriceFieldChanged(field: string, value: string): void {
		if (this.dwellingAsset?.dto?.extra?.rent_price) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: {
					...this.dwellingAsset.dto,
					extra: {
						...this.dwellingAsset.dto.extra,
						rent_price: {
							...this.dwellingAsset.dto.extra.rent_price,
							[field]: value,
						},
					},
				},
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onCountryChanged(value: string): void {
		console.log('countryChanged', value, this.dwellingAsset?.dto);
		if (this.dwellingAsset?.dto) {
			this.dwellingAsset = {
				...this.dwellingAsset,
				dto: { ...this.dwellingAsset.dto, countryID: value },
			};
			this.dwellingAssetChange.emit(this.dwellingAsset);
		}
	}

	protected onAssetChanged(asset: IAssetContext): void {
		console.log(asset.dto);
		this.dwellingAsset = asset as IAssetDwellingContext;
		this.dwellingAssetChange.emit(this.dwellingAsset);
	}
}
