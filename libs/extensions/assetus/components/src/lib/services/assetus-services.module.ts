import { NgModule } from '@angular/core';
import { AssetService } from './asset-service';
import { AssetusSpaceService } from './assetus-space.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  providers: [AssetService, AssetusSpaceService, ReactiveFormsModule],
})
export class AssetusServicesModule {}
