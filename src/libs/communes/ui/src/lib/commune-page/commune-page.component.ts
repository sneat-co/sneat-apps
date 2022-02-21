import { Component } from "@angular/core";
import { LoginRequiredServiceService } from "@sneat/auth";

@Component({
	selector: "sneat-commune-page",
	templateUrl: "./commune-page.component.html",
})
export class CommunePageComponent {
	constructor(
		private readonly loginRequiredService: LoginRequiredServiceService
	) {
	}
}
