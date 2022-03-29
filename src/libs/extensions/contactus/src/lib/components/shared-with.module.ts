import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SharedWithComponent} from './shared-with.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	entryComponents: [
		SharedWithComponent
	],
	declarations: [
		SharedWithComponent,
	],
	exports: [
		SharedWithComponent,
	],
})
export class SharedWithModule {
}
