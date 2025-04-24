import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonItemDivider,
	IonLabel,
	IonSpinner,
	IonText,
	IonToolbar,
} from '@ionic/angular/standalone';
import { LogistSpaceMenuItemsModule } from '../../components/logist-team-menu-items/logist-space-menu-items.module';
import { LogistSpaceSettingsModule } from '../../components/logist-team-settings/logist-space-settings.module';
import { LogistSpaceService } from '../../services/logist-space.service';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-main-page',
	templateUrl: './logist-space-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonText,
		IonContent,
		IonCard,
		IonCardContent,
		IonSpinner,
		IonItemDivider,
		NgIf,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		LogistSpaceMenuItemsModule,
		LogistSpaceSettingsModule,
	],
})
export class LogistSpacePageComponent extends LogistSpaceBaseComponent {
	constructor(logistTeamService: LogistSpaceService) {
		super('LogistSpacePageComponent', logistTeamService);
	}
}
