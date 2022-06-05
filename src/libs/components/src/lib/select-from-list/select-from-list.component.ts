import { Component, EventEmitter, forwardRef, Inject, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

export interface ISelectItem {
	readonly id: string;
	readonly title: string;
	readonly emoji?: string;
	readonly iconName?: string;
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
	@Input() radioSlot: 'start' | 'end' = 'start';
	@Input() other: 'top' | 'bottom' | 'none' = 'none';
	// @Input() ngModel?: string;
	// @Output() readonly ngModelChange = new EventEmitter<string>();

	@Output() changed = new EventEmitter<string>();

	@ViewChild(IonInput, { static: false }) addInput?: IonInput;

	public isDisabled = false;

	public filter = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	onRadioChanged(event: Event): void {
		this.value = (event as CustomEvent).detail['value'] as string;
		this.onChange(this.value);
	}

	onChange = (_: any) => {
		// this.ngModelChange.emit(this.ngModel);
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
