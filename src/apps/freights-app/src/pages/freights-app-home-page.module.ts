import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  ExpressMenuModule
} from '../../../../libs/extensions/express/src/lib/components/express-menu/express-menu.module';
import { FreightsAppHomePageComponent } from './freights-app-home-page.component';

const routes: Routes = [
	{
		path: '',
		component: FreightsAppHomePageComponent,
	},
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ExpressMenuModule,
  ],
	declarations: [FreightsAppHomePageComponent],
})
export class FreightsAppHomePageModule {

}
