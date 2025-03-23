import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpacePageTitleComponent } from './team-page-title/space-page-title.component';

const exports = [SpacePageTitleComponent];

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	declarations: [...exports],
	exports: exports,
})
export class SpaceCoreComponentsModule {}
