import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { buildInfo } from './build-info';

@Component({
	standalone: true,
	selector: 'sneat-app-version',
	templateUrl: 'app-version.component.html',
	imports: [CommonModule, IonicModule],
})
export class AppVersionComponent {
	protected readonly buildInfo = buildInfo;
}
