import { Component } from '@angular/core';
import { LogistSpaceService } from '../../services';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-space-settings-page',
	templateUrl: 'logist-space-settings-page.component.html',
	standalone: false,
})
export class LogistSpaceSettingsPageComponent extends LogistSpaceBaseComponent {
	constructor(logistTeamService: LogistSpaceService) {
		super('LogistTeamSettingsPageComponent', logistTeamService);
	}
}
