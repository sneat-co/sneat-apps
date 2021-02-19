import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DataboardsPageRoutingModule} from './boards-routing.module';

import {BoardsPage} from './boards-page.component';
import {SneatCardListModule} from '@sneat/components/card-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataboardsPageRoutingModule,
    SneatCardListModule,
  ],
  declarations: [BoardsPage]
})
export class BoardsPageModule {
}
