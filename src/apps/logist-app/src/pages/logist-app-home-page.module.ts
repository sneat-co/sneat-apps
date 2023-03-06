import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistAppHomePageComponent } from './logist-app-home-page.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LogistMenuModule } from '@sneat/extensions/express'; // TODO: HELP WANTED: find how to fix it

const routes: Routes = [
	{
		path: '',
		component: LogistAppHomePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistMenuModule,
	],
	declarations: [LogistAppHomePageComponent],
})
export class LogistAppHomePageModule {

}
