import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonTextarea,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { SneatBaseModalComponent } from '@sneat/ui';

@Component({
	imports: [
		IonButton,
		IonButtons,
		IonIcon,
		IonInput,
		IonItem,
		IonLabel,
		ReactiveFormsModule,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonFooter,
		IonTextarea,
	],
	templateUrl: './happening-title-modal.component.html',
	selector: 'sneat-happening-title-modal',
})
export class HappeningTitleModalComponent
	extends SneatBaseModalComponent
	implements OnInit
{
	@Input({ required: true }) happening?: IHappeningContext;

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;

	protected readonly title = new FormControl<string>('', Validators.required);
	protected readonly brief = new FormControl<string>('');
	protected readonly description = new FormControl<string>('');

	protected readonly form = new FormGroup({
		title: this.title,
	});

	protected onEnter(event: Event): void {
		console.log('onEnter()', event);
	}

	constructor() {
		super('HappeningTitleModalComponent');
	}

	ngOnInit(): void {
		const h = this.happening || { id: '', space: { id: '' } };
		this.title.setValue(h?.dbo?.title || h?.brief?.title || h.id);
	}
}
