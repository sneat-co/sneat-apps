import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {PupilsPageComponent} from './pupils-page.component';
import {SharedComponentsModule} from 'sneat-shared/components/shared-components.module';
import {SneatAppComponentsModule} from '../../../../../projects/sneat-app/src/app/components/sneat-app-components.module';

const routes: Routes = [
	{
		path: '',
		component: PupilsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SharedComponentsModule,
		SneatAppComponentsModule,
	],
	declarations: [PupilsPageComponent]
})
export class PupilsPageModule {
}
