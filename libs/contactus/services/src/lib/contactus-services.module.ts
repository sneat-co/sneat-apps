import { NgModule } from '@angular/core';
import { ContactGroupService } from './contact-group-service';
import { ContactNavService } from './contact-nav-service';
import { ContactRoleService } from './contact-role.service';
import { ContactService } from './contact-service';

@NgModule({
	imports: [],
	providers: [
		ContactService,
		ContactNavService,
		ContactGroupService,
		ContactRoleService,
	],
})
export class ContactusServicesModule {}
