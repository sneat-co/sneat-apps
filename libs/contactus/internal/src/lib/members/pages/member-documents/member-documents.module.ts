import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MemberDocumentsPageComponent } from './member-documents-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberDocumentsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [MemberDocumentsPageComponent],
})
export class MemberDocumentsPageModule {}
