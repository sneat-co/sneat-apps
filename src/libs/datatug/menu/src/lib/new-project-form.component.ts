import {Component, Inject, Input} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

@Component({
	selector: 'datatug-new-project-form',
	templateUrl: 'new-project-form.component.html'
})
export class NewProjectFormComponent {
	store = 'cloud';
	title = '';

	@Input() onCancel?: () => void;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly popoverCtrl: PopoverController,
	) {
	}

	cancel(): void {
		if (this.onCancel) {
			this.onCancel();
		}
	}
}
