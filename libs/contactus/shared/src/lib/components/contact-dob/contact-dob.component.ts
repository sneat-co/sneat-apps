import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IContactContext } from "@sneat/team/models";

@Component({
	selector: "sneat-contact-dob",
	templateUrl: "./contact-dob.component.html",
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
	],
})
export class ContactDobComponent {
	@Input({ required: true }) public contact?: IContactContext;
}
