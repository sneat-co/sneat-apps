import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssetListItemComponent } from './asset-list-item.component';
import { AssetsListComponent } from '.';
import { MileageDialogComponentModule } from '../mileage-dialog/mileage-dialog.component.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MileageDialogComponentModule,
	],
	declarations: [AssetsListComponent, AssetListItemComponent],
	exports: [AssetsListComponent],
})
export class AssetsListComponentModule {}
