import { Component, EventEmitter, Output } from "@angular/core";
import { SelectOption } from "@sneat/wizard";

@Component({
	selector: "sneat-new-family-wizard",
	templateUrl: "./new-family-wizard.component.html",
	styleUrls: ["./new-family-wizard.component.scss"],
})
export class NewFamilyWizardComponent {

	@Output() ready = new EventEmitter<boolean>();

	partnerStatus?: string;
	numberOfKids?: string;

	public readonly relationshipOptions: SelectOption[] = [
		{ value: "married", title: "I'm married" },
		{ value: "partner", title: "I have a partner" },
		{ value: "single", title: "I am single" },
		{ value: "undisclosed", title: "I prefer not to disclose at this stage" },
	];

	public readonly rangeOptions0to7 = [
		{ value: "0" },
		{ value: "1" },
		{ value: "2" },
		{ value: "3" },
		{ value: "4" },
		{ value: "5" },
		{ value: "6" },
		{ value: "7" },
		{ value: "undisclosed", title: "I prefer not to disclose at this stage" },
	];

	get isReady(): boolean {
		return !!this.partnerStatus && !!this.numberOfKids;
	}

	onFormChanged(event: Event): void {
		this.ready.emit(this.isReady);
	}

}
