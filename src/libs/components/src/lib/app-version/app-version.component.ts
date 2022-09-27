import { Component } from '@angular/core';
import {gitHash} from './git-version';

@Component({
	selector: 'sneat-app-version',
	templateUrl: 'app-version.component.html',
})
export class AppVersionComponent {
	protected readonly gitHash = gitHash;
}
