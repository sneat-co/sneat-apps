import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DispatchersComponent } from './dispatchers.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		DispatchersComponent,
	],
	exports: [
		DispatchersComponent,
	]
})
export class DispatchersModule {

}
