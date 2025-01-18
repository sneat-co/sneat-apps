import { NgModule } from '@angular/core';
import { ContactSelectorComponent } from './contact-selector.component';
import { ContactSelectorService } from './contact-selector.service';

@NgModule({
	providers: [
		{
			provide: ContactSelectorComponent,
			useClass: ContactSelectorComponent,
		},
		ContactSelectorService,
	],
})
export class ContactSelectorServiceModule {}
