import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from './index';
import { TeamPageTitleComponent } from './team-page-title/team-page-title.component';

const exports = [AvatarComponent, TeamPageTitleComponent];

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	declarations: [...exports],
	exports: exports,
})
export class TeamCoreComponentsModule {}
