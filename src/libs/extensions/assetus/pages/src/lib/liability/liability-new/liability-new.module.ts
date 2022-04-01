import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LiabilityNewPageComponent} from './liability-new-page.component';

const routes: Routes = [
	{
		path: '',
		component: LiabilityNewPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [LiabilityNewPageComponent]
})
export class LiabilityNewPageModule {
}
