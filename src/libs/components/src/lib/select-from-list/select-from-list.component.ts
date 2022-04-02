import { Component, EventEmitter, forwardRef, Inject, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

export interface ISelectItem {
	id: string;
	title: string;
	emoji?: string;
	iconName?: string;
}

@Component({
	selector: 'sneat-select-from-list',
	templateUrl: './select-from-list.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectFromListComponent),
		multi: true,
	}],
})
export class SelectFromListComponent implements ControlValueAccessor {
	@Input() value = '';
	@Input() title = 'Please choose';
	@Input() isFilterable?: boolean;
	@Input() isLoading?: boolean;
	@Input() items?: ISelectItem[];

	@Output() changed = new EventEmitter<string>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;

	public isDisabled = false;

	public filter = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	onChange = (_: any) => {
		//
	};

	onTouched = () => {
		//
	};

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
	}

	writeValue(obj: any): void {
		this.value = obj as string;
	}


}
