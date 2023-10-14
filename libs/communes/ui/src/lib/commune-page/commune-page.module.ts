import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginRequiredComponent } from '@sneat/auth-ui';
import { CommunePageComponent } from './commune-page.component';

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
		// SneatAuthServicesModule,
		LoginRequiredComponent,
	],
	declarations: [CommunePageComponent],
})
export class CommunePageModule {}
