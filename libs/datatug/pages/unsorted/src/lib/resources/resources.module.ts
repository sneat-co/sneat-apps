import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcesPageRoutingModule } from './resources-routing.module';

import { ResourcesPageComponent } from './resources-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, ResourcesPageRoutingModule],
	declarations: [ResourcesPageComponent],
})
export class ResourcesPageModule {}
