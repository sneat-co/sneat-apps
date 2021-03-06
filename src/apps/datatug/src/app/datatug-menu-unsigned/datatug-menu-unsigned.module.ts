import {NgModule} from '@angular/core';
import {DatatugMenuUnsignedComponent} from './datatug-menu-unsigned.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
  ],
  declarations: [
    DatatugMenuUnsignedComponent,
  ],
  exports: [
    DatatugMenuUnsignedComponent,
  ],
})
export class DatatugMenuUnsignedModule {
}
