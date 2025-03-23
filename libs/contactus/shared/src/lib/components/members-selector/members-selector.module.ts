import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	ContactTitlePipe,
	MembersAsBadgesComponent,
	PersonTitle,
} from '@sneat/components';
import { MembersSelectorInputComponent } from './members-selector-input.component';
import { MembersSelectorListComponent } from './members-selector-list.component';
import { MembersSelectorModalComponent } from './members-selector-modal.component';
import { MembersSelectorService } from './members-selector.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		MembersAsBadgesComponent,
		ContactTitlePipe,
		PersonTitle,
	],
	providers: [MembersSelectorService],
	declarations: [
		MembersSelectorInputComponent,
		MembersSelectorListComponent,
		MembersSelectorModalComponent,
	],
	exports: [
		MembersSelectorInputComponent,
		MembersSelectorListComponent,
		MembersSelectorModalComponent,
	],
})
export class MembersSelectorModule {}
