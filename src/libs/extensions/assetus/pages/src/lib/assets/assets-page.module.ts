import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import { AssetsListComponentModule } from '@sneat/extensions/assetus/components';
import { TeamComponentContextModule } from '@sneat/team/components';

import {AssetsPageComponent} from './assets-page.component';

const routes: Routes = [
	{
		path: '',
		component: AssetsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamComponentContextModule,
		AssetsListComponentModule,
		// SharedComponentsModule,
		RouterModule.forChild(routes)
	],
	declarations: [AssetsPageComponent]
})
export class AssetsPageModule {
}
