import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMetricPageRoutingModule } from './add-metric-routing.module';

import { AddMetricPageComponent } from './add-metric-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, AddMetricPageRoutingModule],
	declarations: [AddMetricPageComponent],
})
export class AddMetricPageModule {}
