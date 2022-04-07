import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { IListItemBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-new-list-item',
	template: `
		<form (ngSubmit)="add()">
			<ion-item>
				<!--suppress AngularUndefinedBinding -->
				<ion-input [disabled]="disabled" #newItemInput autofocus="true" [(ngModel)]="title" name="title"
									 placeholder="New item"
									 (ionFocus)="focused()"
				></ion-input>
				<ion-button fill="outline" size="small" (click)="add()" slot="end" *ngIf="isFocused && title.trim()">
					Add
				</ion-button>
			</ion-item>
		</form>
	`,
})
export class NewListItemComponent {
	isFocused = false;

	@Input() disabled = false;

	@ViewChild('newItemInput', { static: false }) newItemInput?: IonInput;

	@Output() added = new EventEmitter<IListItemBrief>();

	public title = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}


	focused(): void {
		console.log('focused');
		this.isFocused = true;
	}

	add(): void {
		console.log('add()');
		if (!this.title.trim()) {
			return;
		}
		const item: IListItemBrief = { id: '', title: this.title };
		this.added.emit(item);
		this.isFocused = false;
	}

	clear(): void {
		console.log('NewListItem.clear()');
		this.title = '';
	}

	focus(): void {
		console.log('NewListItem.focus()');
		if (!this.newItemInput) {
			this.errorLogger.logError('!this.newItemInput');
			return;
		}
		this.newItemInput.setFocus()
			.catch(this.errorLogger.logError);
	}
}
