import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpressMainPageComponent } from './express-main-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExpressMainPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		ExpressMainPageComponent,
	],
})
export class ExpressMainPageModule {
}
