import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContainerPointComponent } from './container-point.component';
import { DispatchPointComponent } from './dispatch-point.component';
import { DispatchersComponent } from './dispatchers.component';
import { DispatcherComponent } from './dispatcher.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		FormsModule,
	],
	declarations: [
		DispatchersComponent,
		DispatcherComponent,
		DispatchPointComponent,
		ContainerPointComponent,
	],
	exports: [
		DispatchersComponent,
	]
})
export class DispatchersModule {

}
