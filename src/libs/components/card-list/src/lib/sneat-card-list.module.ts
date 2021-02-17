import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {SneatCardListComponent} from './sneat-card-list.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [SneatCardListComponent],
  exports: [SneatCardListComponent]
})
export class SneatCardListModule {
}
