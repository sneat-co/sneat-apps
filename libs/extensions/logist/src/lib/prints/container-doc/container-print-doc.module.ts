import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistOrderServiceModule } from '../../services';
import { ContainerPrintDocComponent } from './container-print-doc.component';

const routes: Routes = [
	{
		path: '',
		component: ContainerPrintDocComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistOrderServiceModule,
	],
	declarations: [ContainerPrintDocComponent],
})
export class ContainerPrintDocModule {}
