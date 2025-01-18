import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { SpacePageTitleComponent } from './team-page-title/space-page-title.component';

const exports = [AvatarComponent, SpacePageTitleComponent];

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	declarations: [...exports],
	exports: exports,
})
export class SpaceCoreComponentsModule {}
