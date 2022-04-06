import {NgModule} from '@angular/core';
import {MovieCardComponent} from './movie-card.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@NgModule({
	declarations: [MovieCardComponent],
	entryComponents: [MovieCardComponent],
	imports: [
		IonicModule,
		CommonModule,
	],
	exports: [MovieCardComponent]
})
export class MovieCardComponentModule {
}
