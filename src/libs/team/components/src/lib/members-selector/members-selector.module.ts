import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MembersAsBadgesModule, SneatPipesModule } from '@sneat/components';
import { MembersSelectorInputComponent } from './members-selector-input.component';
import { MembersSelectorModalComponent } from './members-selector-modal.component';
import { MembersSelectorService } from './members-selector.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		MembersAsBadgesModule,
	],
	providers: [
		MembersSelectorService,
	],
	declarations: [
		MembersSelectorInputComponent,
		MembersSelectorModalComponent,
	],
	exports: [
		MembersSelectorInputComponent,
		MembersSelectorModalComponent,
	]
})
export class MembersSelectorModule {
}
