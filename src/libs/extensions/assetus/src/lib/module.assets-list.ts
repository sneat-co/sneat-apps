import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {AssetsListComponent} from './components/assets-list/assets-list.component';
import {AssetListItemComponent} from './components/assets-list/asset-list-item.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [AssetsListComponent, AssetListItemComponent],
	exports: [AssetsListComponent],
})
export class ModuleAssetsList {
}
