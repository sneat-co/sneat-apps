import { NgModule } from '@angular/core';
import { ContactsSelectorComponent } from './contacts-selector.component';
import { ContactsSelectorService } from './contacts-selector.service';

@NgModule({
	providers: [
		{
			provide: ContactsSelectorComponent,
			useClass: ContactsSelectorComponent,
		},
		ContactsSelectorService,
	],
})
export class ContactsSelectorModule {}
