import {NgModule} from '@angular/core';
import {DatatugMenuUnsignedComponent} from './datatug-menu-unsigned.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
	declarations: [
		DatatugMenuUnsignedComponent,
	],
	exports: [
		DatatugMenuUnsignedComponent,
	],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
	],
})
export class DatatugMenuUnsignedModule {
}
