import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieInfoPageComponent } from './movie-info-page.component';

const routes: Routes = [
	{
		path: '',
		component: MovieInfoPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		NgOptimizedImage,
	],
	declarations: [MovieInfoPageComponent],
})
export class MovieInfoPageModule {}
