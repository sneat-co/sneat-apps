import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AddAssetComponentsModule } from '@sneat/extensions/assetus/components';
import { TeamComponentContextModule } from '@sneat/team/components';

import { NewAssetPageComponent } from './new-asset-page.component';

const routes: Routes = [
	{
		path: '',
		component: NewAssetPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamComponentContextModule,
		AddAssetComponentsModule,
	],
	declarations: [NewAssetPageComponent],
})
export class NewAssetPageModule {
}
