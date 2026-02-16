import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonCard,
  IonItemDivider,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { CountrySelectorComponent } from '@sneat/components';
import {
  carMakes,
  IAssetContext,
  IAssetVehicleContext,
  IAssetVehicleExtra,
} from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/space-models';
import { AssetPossessionCardComponent } from '../asset-possesion-card/asset-possession-card.component';
import { AssetRegNumberInputComponent } from '../asset-reg-number-input/asset-reg-number-input.component';
import { MakeModelCardComponent } from '../make-model-card/make-model-card.component';
import { VehicleEngineComponent } from '../vehicle-engine/vehicle-engine.component';

// import {carMakes} from 'sneat-shared/models/data/vehicles';

@Component({
  selector: 'sneat-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    // SelectFromListComponent,
    CountrySelectorComponent,
    MakeModelCardComponent,
    AssetPossessionCardComponent,
    VehicleEngineComponent,
    AssetRegNumberInputComponent,
    IonCard,
    IonList,
    IonItemDivider,
    IonLabel,
  ],
})
export class VehicleCardComponent implements OnChanges {
  @Input({ required: true }) space?: ISpaceContext;

  @Input({ required: true }) vehicleAsset?: IAssetVehicleContext;
  @Output() readonly vehicleAssetChange = new EventEmitter<IAssetContext>();

  protected readonly regNumber = new FormControl<string>('');

  makeVal?: string;
  modelVal?: string | undefined;

  makes?: string[];
  models: string[] | undefined;
  engine = '';
  yearBuildNumber?: number;
  yearBuildVal?: string;

  @Input() set make(v: string) {
    this.makeVal = v;
    this.makes = Object.keys(carMakes);
    this.populateModels();
  }

  @Input() set model(v: string) {
    this.modelVal = v;
  }

  @Input() set yearBuild(v: number) {
    this.yearBuildNumber = v;
    this.yearBuildVal = v.toString();
  }

  @ViewChild(AssetRegNumberInputComponent, { static: false })
  regNumberInputComponent?: AssetRegNumberInputComponent;

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['space'] && this.team?.dto?.countryID && this.vehicleAsset?.dto && !this.vehicleAsset.dto.countryID) {
    // 	this.vehicleAsset = { ...this.vehicleAsset, dto: { ...this.vehicleAsset.dto, countryID: this.team.dto.countryID } };
    // 	this.vehicleAssetChange.emit(this.vehicleAsset);
    // }
    if (changes['vehicleAsset']) {
      if (!this.regNumber.dirty) {
        const extra = this.vehicleAsset?.brief?.extra as
          | IAssetVehicleExtra
          | undefined;
        this.regNumber.setValue(extra?.regNumber || '');
      }
    }
  }

  countryChanged(value: string): void {
    if (this.vehicleAsset?.dbo) {
      this.vehicleAsset = {
        ...this.vehicleAsset,
        dbo: { ...this.vehicleAsset.dbo, countryID: value },
      };
      this.vehicleAssetChange.emit(this.vehicleAsset);
      setTimeout(
        () => this.regNumberInputComponent?.focusToRegNumberInput(),
        100,
      );
    }
  }

  protected regNumberSkipped = false;

  protected onRegNumberSkipped(): void {
    this.regNumberSkipped = true;
  }

  protected onRegNumberChanged(value: string): void {
    this.regNumber.setValue(value);
    if (this.vehicleAsset?.dbo) {
      const extra = {
        ...(this.vehicleAsset.dbo.extra as IAssetVehicleExtra),
        regNumber: value,
      };
      this.vehicleAsset = {
        ...this.vehicleAsset,
        dbo: {
          ...this.vehicleAsset.dbo,
          extra,
        },
      };
      this.vehicleAssetChange.emit(this.vehicleAsset);
    }
  }

  makeChanged(make: string): void {
    this.makeVal = make;
    if (this.vehicleAsset?.dbo) {
      this.vehicleAsset = {
        ...this.vehicleAsset,
        dbo: {
          ...this.vehicleAsset.dbo,
          extra: {
            ...(this.vehicleAsset.dbo.extra as IAssetVehicleExtra),
            make,
          },
        },
      };
      this.vehicleAssetChange.emit(this.vehicleAsset);
    }
    this.populateModels();
  }

  protected onAssetChanged(asset: IAssetContext): void {
    this.vehicleAsset = asset as IAssetVehicleContext;
    this.vehicleAssetChange.emit(this.vehicleAsset);
  }

  protected modelChanged(model: string): void {
    if (this.vehicleAsset?.dbo) {
      this.vehicleAsset = {
        ...this.vehicleAsset,
        dbo: {
          ...this.vehicleAsset.dbo,
          extra: {
            ...(this.vehicleAsset.dbo.extra as IAssetVehicleExtra),
            model,
          },
        },
      };
      this.vehicleAssetChange.emit(this.vehicleAsset);
    }
  }

  private populateModels(): void {
    if (!this.makeVal) {
      this.models = undefined;
      this.modelVal = undefined;
      return;
    }
    const make = carMakes[this.makeVal];
    this.models = make.models.map((v) => v.id);
    if (this.modelVal && this.models.indexOf(this.modelVal) <= 0) {
      this.modelVal = undefined;
    }
  }
}
