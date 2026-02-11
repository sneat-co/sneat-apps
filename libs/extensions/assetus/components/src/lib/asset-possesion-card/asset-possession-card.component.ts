import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import {
  AssetPossession,
  AssetPossessions,
  IAssetContext,
} from '@sneat/mod-assetus-core';

@Component({
  selector: 'sneat-asset-possession-card',
  templateUrl: './asset-possession-card.component.html',
  imports: [FormsModule, SelectFromListComponent, IonCard, IonItem, IonLabel],
})
export class AssetPossessionCardComponent {
  @Input() public asset?: IAssetContext;
  @Output() public readonly assetChange = new EventEmitter<IAssetContext>();

  protected readonly possessionOptions: ISelectItem[] = AssetPossessions.map(
    (p) => ({
      id: p,
      title: p,
      iconName: 'radio-button-off',
    }),
  );

  protected onPossessionChanged(possession: string): void {
    if (this.asset?.dbo) {
      this.asset = {
        ...this.asset,
        dbo: { ...this.asset.dbo, possession: possession as AssetPossession },
      };
      this.assetChange.emit(this.asset);
    }
    console.log('onPossessionChanged', possession, this.asset);
  }
}
