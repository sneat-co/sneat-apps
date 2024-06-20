import { NgModule } from '@angular/core';
import { AssetService, AssetusTeamService } from '.';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	providers: [AssetService, AssetusTeamService, ReactiveFormsModule],
})
export class AssetusServicesModule {}
