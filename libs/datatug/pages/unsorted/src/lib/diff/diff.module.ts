import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DiffPageRoutingModule } from './diff-routing.module';
import { DiffPageComponent } from './diff-page.component';

@NgModule({
	imports: [CommonModule, IonicModule, DiffPageRoutingModule],
	declarations: [DiffPageComponent],
})
export class DiffPageModule {}
