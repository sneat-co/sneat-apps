import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberPageRoutingModule } from './member-routing.module';

import { MemberPageComponent } from './member.page';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, MemberPageRoutingModule],
	declarations: [MemberPageComponent],
})
export class MemberPageModule {}
