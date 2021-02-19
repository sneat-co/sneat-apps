import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProjectPageRoutingModule} from './project-routing.module';
import {ProjectPage} from './project.page';
import {SneatCardListModule} from '@sneat/components/card-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectPageRoutingModule,
    SneatCardListModule,
  ],
  declarations: [ProjectPage],
})
export class ProjectPageModule {
}
