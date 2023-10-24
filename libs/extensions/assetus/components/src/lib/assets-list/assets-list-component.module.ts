import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssetListItemComponent } from './asset-list-item.component';
import { AssetsListComponent } from '.';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule],
	declarations: [AssetsListComponent, AssetListItemComponent],
	exports: [AssetsListComponent],
})
export class AssetsListComponentModule {}
