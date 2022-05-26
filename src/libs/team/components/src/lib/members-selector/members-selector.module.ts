import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { MembersSelectorComponent } from './members-selector.component';
import { MembersSelectorService } from './members-selector.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
	],
	providers: [
		MembersSelectorService,
	],
	declarations: [
		MembersSelectorComponent,
	],
})
export class MembersSelectorModule {
}
