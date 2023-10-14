import { NgModule } from '@angular/core';
import { ContactNavService } from './contact-nav-service';
import { ContactService } from './contact-service';

@NgModule({
	imports: [],
	providers: [ContactService, ContactNavService],
})
export class ContactServiceModule {}
