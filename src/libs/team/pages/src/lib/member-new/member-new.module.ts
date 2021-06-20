import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MemberNewPageRoutingModule} from './member-new-routing.module';
import {MemberNewPage} from './member-new.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MemberNewPageRoutingModule,
  ],
  declarations: [
    MemberNewPage,
  ],
})
export class MemberNewPageModule {
}
