import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DatatugSignedOutPageRoutingModule } from './datatug-signed-out-routing.module';

import { DatatugSignedOutPage } from './datatug-signed-out-page.component';

@NgModule({
	imports: [CommonModule, IonicModule, DatatugSignedOutPageRoutingModule],
	declarations: [DatatugSignedOutPage],
})
export class DatatugSignedOutPageModule {
}
