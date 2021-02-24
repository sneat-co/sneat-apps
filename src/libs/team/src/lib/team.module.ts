import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AvatarComponent, InviteLinksComponent} from './components';
import {TeamNavService} from './services/team-nav.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  providers: [
    TeamNavService,
  ],
  declarations: [
    AvatarComponent,
    InviteLinksComponent,
  ],
  exports: [
    AvatarComponent,
    InviteLinksComponent,
  ],
})
export class TeamModule {
}
