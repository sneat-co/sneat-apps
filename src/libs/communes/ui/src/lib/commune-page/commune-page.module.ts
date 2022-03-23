import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommunePageComponent } from './commune-page.component';
import { SneatAuthModule } from '@sneat/auth';

const routes: Routes = [
	{
		path: '',
		component: CommunePageComponent,
	},
];


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule.forChild(routes),
		SneatAuthModule,
	],
	declarations: [CommunePageComponent],
})
export class CommunePageModule {
}
