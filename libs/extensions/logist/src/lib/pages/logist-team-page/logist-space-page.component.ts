import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { LogistSpaceMenuItemsComponent } from '../../components/logist-team-menu-items/logist-space-menu-items.component';
import { LogistSpaceSettingsComponent } from '../../components/logist-team-settings/logist-space-settings.component';
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
		LogistSpaceSettingsComponent,
		LogistSpaceMenuItemsComponent,
		IonTitle,
		RouterLink,
	],
})
export class LogistSpacePageComponent extends LogistSpaceBaseComponent {
	constructor(logistTeamService: LogistSpaceService) {
		super('LogistSpacePageComponent', logistTeamService);
	}
}
