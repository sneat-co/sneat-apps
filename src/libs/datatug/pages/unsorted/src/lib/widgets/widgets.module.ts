import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WidgetsPageRoutingModule } from './widgets-routing.module';

import { WidgetsPageComponent } from './widgets-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, WidgetsPageRoutingModule],
	declarations: [WidgetsPageComponent],
})
export class WidgetsPageModule {}
