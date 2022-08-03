import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DispatchPointComponent } from './dispatch-point.component';
import { DispatchersComponent } from './dispatchers.component';
import { DispatcherComponent } from './dispatcher.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		DispatchersComponent,
		DispatcherComponent,
		DispatchPointComponent,
	],
	exports: [
		DispatchersComponent,
	]
})
export class DispatchersModule {

}
