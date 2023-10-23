import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagsPageRoutingModule } from './tags-routing.module';

import { TagsPageComponent } from './tags-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, TagsPageRoutingModule],
	declarations: [TagsPageComponent],
})
export class TagsPageModule {}
