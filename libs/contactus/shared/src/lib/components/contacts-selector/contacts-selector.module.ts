import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
	imports: [IonicModule],
})
export class ContactsSelectorModule {}
