import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import { IRecord } from '@sneat/data';
import { IOptionallyTitled, IProjItemBrief } from '@sneat/datatug/models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Observable } from 'rxjs';

export interface ICardTab {
	id: string;
	title: string;
}

@Component({
	selector: 'sneat-card-list',
	templateUrl: './sneat-card-list.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
	],
})
export class SneatCardListComponent {
	@Input() title?: string;
	@Input() isFilterable?: boolean;
	@Input() isLoading?: boolean;
	@Input() items?: IProjItemBrief[];
	@Input() create?: (name: string) => Observable<IRecord<IOptionallyTitled>>;
	@Input() itemIcon?: string;
	@Input() tab?: string;
	@Input() tabs?: ICardTab[];
	@Input() noItemsText?: string;
	@Input() getRouterLink?: (item: IProjItemBrief) => string | undefined;

	@Output() cardTitleClick = new EventEmitter<void>();
	@Output() itemClick = new EventEmitter<IProjItemBrief>();
	@Output() tabChanged = new EventEmitter<string>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;

	filter = '';

	public mode: 'list' | 'add' = 'list';
	public name = '';
	public isAdding?: boolean;

	protected readonly id = (_: number, o: { id: string }) => o.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	click(event: Event, item: IProjItemBrief): void {
		event.preventDefault();
		event.stopPropagation();
		this.itemClick.emit(item);
	}

	public showAddForm(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.mode = 'add';
		setTimeout(() => {
			console.log(this.addInput);
			if (this.addInput) {
				this.addInput
					?.setFocus()
					.catch((err) => this.errorLogger.logError(err, 'Failed to set focus'));
			}
		}, 200);
	}

	tryCreate(): void {
		this.isAdding = true;
		if (this.create) {
			this.create(this.name.trim()).subscribe({
				next: (item) => {
					this.items?.push(item);
					this.isAdding = false;
					this.mode = 'list';
					this.name = '';
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to create new item');
					this.isAdding = false;
				},
			});
		}
	}
}
