import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AddToWatchPage} from './add-to-watch.page';
import {TmdbService} from '../../watchlist/tmdb.service';
import {MovieCardComponentModule} from '../../movie-card/movie-card.component.module';

const routes: Routes = [
	{
		path: '',
		component: AddToWatchPage
	}
];

@NgModule({
	imports: [
		MovieCardComponentModule,
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	providers: [TmdbService],
	declarations: [AddToWatchPage]
})
export class AddToWatchPageModule {
}
