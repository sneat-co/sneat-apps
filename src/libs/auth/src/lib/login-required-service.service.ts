import { Injectable } from "@angular/core";
import { SneatAuthStateService } from "./sneat-auth-state-service";

@Injectable({
	providedIn: "root",
})
export class LoginRequiredServiceService {

	constructor(
		authState: SneatAuthStateService,
	) {
		console.log('LoginRequiredServiceService.constructor()');
		authState.authState.subscribe(state => {
			console.log("LoginRequiredServiceService => authState:", state);
		});
	}
}
