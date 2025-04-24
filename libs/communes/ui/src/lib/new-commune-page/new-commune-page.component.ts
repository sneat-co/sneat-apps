import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonRadio,
	IonRadioGroup,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { NewFamilyWizardComponent } from '../new-family-wizard/new-family-wizard.component';

interface ICommuneType {
	code: string;
	title: string;
	emoji: string;
}

@Component({
	selector: 'sneat-new-commune-page',
	templateUrl: './new-commune-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonIcon,
		IonSelect,
		IonSelectOption,
		IonListHeader,
		IonRadioGroup,
		IonRadio,
		IonInput,
		IonCard,
		IonCardContent,
		NewFamilyWizardComponent,
		FormsModule,
		IonButton,
	],
})
export class NewCommunePageComponent {
	public types: ICommuneType[] = [
		{ code: 'family', title: 'Family', emoji: '👨‍👩‍👧‍👦' },
		{ code: 'friends', title: 'Friends', emoji: '🤝' },
	];
	public code?: string;
	public icon?: string;
	public name = '';
	formIsReady?: boolean;
	@ViewChild('nameInput') nameInput?: IonInput;

	public onTypeChanged(): void {
		setTimeout(() => {
			this.nameInput?.setFocus().then(() => console.log('set focus to name'));
		}, 100);
	}

	public onFormReadyChanged(value: boolean): void {
		this.formIsReady = value;
	}
}
