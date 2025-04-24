import { Component, forwardRef, Input } from '@angular/core';
import {
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonRadio,
	IonRadioGroup,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { SelectOption } from './select-options';
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
	selector: 'sneat-radio-group-to-select',
	templateUrl: './radio-group-to-select.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RadioGroupToSelectComponent),
			multi: true,
		},
	],
	standalone: true,
	imports: [
		IonItem,
		IonSelect,
		FormsModule,
		IonSelectOption,
		IonRadioGroup,
		IonList,
		IonLabel,
		IonListHeader,
		IonRadio,
	],
})
export class RadioGroupToSelectComponent implements ControlValueAccessor {
	v?: object;

	@Input() label?: string;
	@Input() selectLabel?: string;
	@Input() radioGroupLabel?: string;

	@Input() slot: 'start' | 'end' = 'start';

	@Input() selectOptions?: SelectOption[];

	@Input() disabled = false;

	private onChange: (v: object | undefined) => void = () => void 0;
	public onTouched: () => void = () => void 0;

	public onValChanged(event: Event): void {
		const e = event as CustomEvent;
		this.onChange(e.detail.value);
	}

	registerOnChange(fn: (v: unknown) => void): void {
		console.log('registerOnChange', fn);
		this.onChange = (v: unknown) => {
			console.log('changed', v, this.value);
			fn(v);
		};
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	//get accessor
	get value(): object | undefined {
		return this.v;
	}

	//set accessor including call the onchange callback
	set value(v: object | undefined) {
		if (v !== this.v) {
			this.v = v;
			this.onChange(v);
		}
	}

	writeValue(obj: object | undefined): void {
		this.value = obj;
	}

	protected readonly screenLeft = screenLeft;
}
