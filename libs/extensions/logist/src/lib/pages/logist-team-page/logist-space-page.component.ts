import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { ClassName } from '@sneat/ui';
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
	providers: [{ provide: ClassName, useValue: 'LogistSpacePageComponent' }],
})
export class LogistSpacePageComponent extends LogistSpaceBaseComponent {
	public constructor() {
		super(inject(LogistSpaceService));
	}
}
