import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IAssetDbo,
  IAssetDboBase,
  IAssetVehicleExtra,
} from '@sneat/mod-assetus-core';

interface AssetDate {
  name: string;
  title: string;
  value?: string;
}

@Component({
  selector: 'sneat-asset-dates',
  templateUrl: './asset-dates.component.html',
  imports: [FormsModule],
})
export class AssetDatesComponent {
  private assetDto?: IAssetDboBase;

  @Input() set asset(v: IAssetDboBase) {
    console.log('AssetDatesComponent => asset:', v);
    this.assetDto = v;
    switch (v.category) {
      case 'vehicle': {
        const vehicle = v as IAssetDbo<'vehicle', IAssetVehicleExtra>;
        this.items = [
          {
            name: 'nctExpires',
            title: 'NCT expires',
            value: vehicle.extra?.nctExpires,
          },
          {
            name: 'taxExpires',
            title: 'Tax expires',
            value: vehicle.extra?.taxExpires,
          },
          {
            name: 'nextServiceDue',
            title: 'Next service due',
            value: vehicle.extra?.nextServiceDue,
          },
        ];
        break;
      }
      case 'dwelling': {
        // const property = v as IDwelling;
        this.items = [
          {
            name: 'leaseExpires',
            title: 'Lease expires',
            value: 'property.leaseExpires',
          },
        ];
        break;
      }
      default:
        this.items = [];
        break;
    }
  }

  @Output() changed = new EventEmitter<{ name: string; value: string }>();

  // constructor(private readonly businessLogic: IBusinessLogic) {}

  protected items?: AssetDate[];

  trackByName(i: number, v: AssetDate): string {
    return v.name;
  }

  onChange(name: string, $event: CustomEvent): void {
    console.log(`AssetDatesComponent.onChange ${name}: `, $event);
    const value = $event.detail.value;
    this.changed.emit({ name, value });
    let title: string;
    switch (name) {
      case 'nctExpires':
        title = 'NCT expires';
        break;
      case 'taxExpires':
        title = 'Tax expires';
        break;
      case 'nextServiceDue':
        title = 'Next service due';
        break;
      default:
        title = name;
        break;
    }
    throw new Error('not implemented yet, title=' + title);
    // if (this.assetDto.id) {
    // 	this.businessLogic
    // 		.changeAssetDate(this.assetDto.id, name, value, title)
    // 		.subscribe((assetDto) => {
    // 			this.assetDto = assetDto;
    // 		});
    // }
  }
}
