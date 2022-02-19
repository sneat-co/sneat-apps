import { Component, EventEmitter, Output } from "@angular/core";

@Component({
	selector: "sneat-new-family-wizard",
	templateUrl: "./new-family-wizard.component.html",
	styleUrls: ["./new-family-wizard.component.scss"],
})
export class NewFamilyWizardComponent {

	@Output() ready = new EventEmitter<boolean>();

	range0to7 = "01234567".split("");

	partnerStatus?: string;
	numberOfKids?: string;

	get isReady(): boolean {
		return !!this.partnerStatus && !!this.numberOfKids;
	}

	onFormChanged(event: Event): void {
		this.ready.emit(this.isReady);
	}

}
