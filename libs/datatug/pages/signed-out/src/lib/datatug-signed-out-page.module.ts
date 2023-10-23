import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DatatugSignedOutPageRoutingModule } from './datatug-signed-out-routing.module';

import { DatatugSignedOutPageComponent } from './datatug-signed-out-page.component';

@NgModule({
	imports: [CommonModule, IonicModule, DatatugSignedOutPageRoutingModule],
	declarations: [DatatugSignedOutPageComponent],
})
export class DatatugSignedOutPageModule {}
