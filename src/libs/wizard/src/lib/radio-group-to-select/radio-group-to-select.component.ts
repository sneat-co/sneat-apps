import { Component, forwardRef, Input } from '@angular/core';
import { SelectOption } from './select-options';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'sneat-radio-group-to-select',
	templateUrl: './radio-group-to-select.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => RadioGroupToSelectComponent),
		multi: true,
	}],
})
export class RadioGroupToSelectComponent implements ControlValueAccessor {

	v?: object;

	@Input() label?: string;
	@Input() selectLabel?: string;
	@Input() radioGroupLabel?: string;

	@Input() slot: 'start' | 'end' = 'start';

	@Input() selectOptions?: SelectOption[];

	private onChange: (v: any) => void = () => void (0);
	public onTouched: () => void = () => void (0);

	public onValChanged(event: Event): void {
		const e = event as CustomEvent;
		this.onChange(e.detail.value);
	}

	registerOnChange(fn: (v: any) => void): void {
		console.log('registerOnChange', fn);
		this.onChange = (v: any) => {
			console.log('changed', v, this.value);
			fn(v);
		};
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	//get accessor
	get value(): any {
		return this.v;
	};

	//set accessor including call the onchange callback
	set value(v: any) {
		if (v !== this.v) {
			this.v = v;
			this.onChange(v);
		}
	}

	writeValue(obj: any): void {
		this.value = obj;
	}

}
