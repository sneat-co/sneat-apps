import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AvatarComponent, InviteLinksComponent } from './index';
import { TeamNavService } from '@sneat/team-services';

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	providers: [TeamNavService],
	declarations: [AvatarComponent, InviteLinksComponent],
	exports: [AvatarComponent, InviteLinksComponent],
})
export class TeamModule {}
