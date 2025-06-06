import { Component, inject } from '@angular/core';
import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { LogistSpaceSettingsComponent } from '../../components/logist-team-settings/logist-space-settings.component';
import { LogistSpaceService } from '../../services';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-space-settings-page',
	templateUrl: 'logist-space-settings-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		LogistSpaceSettingsComponent,
	],
})
export class LogistSpaceSettingsPageComponent extends LogistSpaceBaseComponent {
	constructor() {
		const logistTeamService = inject(LogistSpaceService);

		super('LogistTeamSettingsPageComponent', logistTeamService);
	}
}
