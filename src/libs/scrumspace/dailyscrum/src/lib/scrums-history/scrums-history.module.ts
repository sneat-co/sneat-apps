import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ScrumsHistoryPageRoutingModule} from './scrums-history-routing.module';

import {ScrumsHistoryPage} from './scrums-history.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ScrumsHistoryPageRoutingModule
	],
	declarations: [ScrumsHistoryPage]
})
export class ScrumsHistoryPageModule {
}
