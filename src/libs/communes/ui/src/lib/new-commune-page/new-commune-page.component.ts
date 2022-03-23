import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

interface ICommuneType {
	code: string;
	title: string;
	emoji: string;
}

@Component({
	selector: 'sneat-new-commune-page',
	templateUrl: './new-commune-page.component.html',
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


	public onTypeChanged(event: Event): void {
		setTimeout(() => {
			this.nameInput?.setFocus().then(() => console.log('set focus to name'));
		}, 100);
	}


	public onFormReadyChanged(value: boolean): void {
		this.formIsReady = value;
	}
}
