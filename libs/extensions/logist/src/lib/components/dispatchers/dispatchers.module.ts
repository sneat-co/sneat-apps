import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountryFlagPipe } from '@sneat/components';
import { ContactsSelectorModule } from '@sneat/contactus-shared';
import { DataGridComponent } from '@sneat/datagrid';
import { FreightLoadFormModule } from '../freight-load-form/freight-load-form.module';
import { ContainerPointComponent } from './container-point.component';
import { DispatchPointContainersGridComponent } from './dispatch-point-containers-grid.component';
import { DispatchPointComponent } from './dispatch-point.component';
import { DispatchersComponent } from './dispatchers.component';
import { DispatcherComponent } from './dispatcher.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,

		FormsModule,
		ReactiveFormsModule,
		FreightLoadFormModule,
		DataGridComponent,
		ContactsSelectorModule,
		CountryFlagPipe,
	],
	declarations: [
		DispatchersComponent,
		DispatcherComponent,
		DispatchPointComponent,
		ContainerPointComponent,
		DispatchPointContainersGridComponent,
	],
	exports: [DispatchersComponent, ContainerPointComponent],
})
export class DispatchersModule {}
