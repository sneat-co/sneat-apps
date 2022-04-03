import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AssetsListComponentModule } from '@sneat/extensions/assetus/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';

import { AssetsPageComponent } from './assets-page.component';

const routes: Routes = [
	{
		path: '',
		component: AssetsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AssetsListComponentModule,
		// SharedComponentsModule,
		RouterModule.forChild(routes),
		TeamCoreComponentsModule,
	],
	declarations: [AssetsPageComponent],
})
export class AssetsPageModule {
}
