import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MovieCardComponent } from '../../movie-card';

import { AddToWatchPageComponent } from './add-to-watch-page.component';
import { TmdbService } from '../../watchlist/tmdb.service';

const routes: Routes = [
  {
    path: '',
    component: AddToWatchPageComponent,
  },
];

@NgModule({
  imports: [MovieCardComponent, FormsModule, RouterModule.forChild(routes)],
  providers: [TmdbService],
  declarations: [AddToWatchPageComponent],
})
export class AddToWatchPageModule {}
