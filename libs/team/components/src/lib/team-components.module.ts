import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InviteLinksComponent } from './index';

const exports = [InviteLinksComponent];

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	declarations: [...exports],
	exports: exports,
})
export class TeamComponentsModule {}
