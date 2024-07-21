import { NgModule } from '@angular/core';
import { AssetService, AssetusSpaceService } from '.';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	providers: [AssetService, AssetusSpaceService, ReactiveFormsModule],
})
export class AssetusServicesModule {}
