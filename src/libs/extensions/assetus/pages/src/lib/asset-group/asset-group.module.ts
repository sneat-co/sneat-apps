import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetGroupPageComponent} from './asset-group-page.component';
import {AssetCardComponent} from '../../components/asset-card/asset-card.component';
import {PeriodSegmentComponent} from '../../components/period-segment/period-segment.component';

const routes: Routes = [
	{
		path: '',
		component: AssetGroupPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [AssetGroupPageComponent, AssetCardComponent, PeriodSegmentComponent]
})
export class AssetGroupPageModule {
}
