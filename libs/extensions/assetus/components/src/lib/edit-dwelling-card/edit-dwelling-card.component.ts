import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonCard, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { CountrySelectorComponent } from '@sneat/components';
import { IAssetContext, IAssetDwellingContext } from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/space-models';
import { AssetPossessionCardComponent } from '../asset-possesion-card/asset-possession-card.component';

@Component({
  selector: 'sneat-edit-dwelling-card',
  templateUrl: './edit-dwelling-card.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CountrySelectorComponent,
    AssetPossessionCardComponent,
    IonCard,
    IonList,
    IonItem,
    IonInput,
  ],
})
export class AddDwellingCardComponent implements OnChanges {
  @Input({ required: true }) space?: ISpaceContext;

  @Input({ required: true }) dwellingAsset?: IAssetDwellingContext;
  @Output() readonly dwellingAssetChange = new EventEmitter<IAssetContext>();

  protected title = '';
  protected address = '';
  protected rent_price_amount?: number;
  protected rent_price_currency = 'USD';
  protected number_of_bedrooms?: number;
  protected areaSqM?: number;

  ngOnChanges(changes: SimpleChanges): void {
    const spaceChanges = changes['space'];
    if (
      spaceChanges &&
      this.space?.dbo?.countryID &&
      this.dwellingAsset?.dbo &&
      !this.dwellingAsset.dbo.countryID
    ) {
      this.dwellingAsset = {
        ...this.dwellingAsset,
        dbo: { ...this.dwellingAsset.dbo, countryID: this.space.dbo.countryID },
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
    if (this.dwellingAsset?.dbo) {
      this.dwellingAsset = {
        ...this.dwellingAsset,
        dbo: { ...this.dwellingAsset.dbo, countryID: value },
      };
      this.dwellingAssetChange.emit(this.dwellingAsset);
    }
  }

  protected onAssetChanged(asset: IAssetContext): void {
    this.dwellingAsset = asset as IAssetDwellingContext;
    this.dwellingAssetChange.emit(this.dwellingAsset);
  }
}
