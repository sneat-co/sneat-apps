import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { excludeEmpty, undefinedIfEmpty } from '@sneat/core';
import { IFreightLoad } from '../../dto';

export class FreightLoadForm {
	numberOfPallets = new FormControl<number>(0);
	grossWeightKg = new FormControl<number>(0);
	volumeM3 = new FormControl<number>(0);

	group = new FormGroup({
		numberOfPallets: this.numberOfPallets,
		grossWeightKg: this.grossWeightKg,
		volumeM3: this.volumeM3,
	});
}


@Component({
	selector: 'sneat-freight-load-form',
	templateUrl: './freight-load-form.component.html',
})
export class FreightLoadFormComponent implements OnChanges {

	label = 'TO BE SET';

	@Input() operation?: 'pick' | 'drop';

	@Input() form = new FreightLoadForm();

	@Input() freightLoad?: IFreightLoad;

	@Output() readonly freightLoadChange = new EventEmitter<IFreightLoad | undefined>();

	@Output() readonly keyUpEnter = new EventEmitter<Event>();

	// @Output() readonly dirtyChange = new EventEmitter<boolean>();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['operation']) {
			switch (this.operation) {
				case 'pick':
					this.label = 'To pick';
					break;
				case 'drop':
					this.label = 'To drop';
					break;
				default:
					this.label = 'To be set';
			}
		}
		if (changes['freightLoad']) {
			if (!this.form.numberOfPallets.dirty)
				this.form.numberOfPallets.setValue(this.freightLoad?.numberOfPallets || null);
			if (!this.form.grossWeightKg.dirty)
				this.form.grossWeightKg.setValue(this.freightLoad?.grossWeightKg || null);
			if (!this.form.volumeM3.dirty)
				this.form.volumeM3.setValue(this.freightLoad?.volumeM3 || null);
		}
	}

	onChanged(): void {
		this.freightLoad = undefinedIfEmpty({
			numberOfPallets: this.form.numberOfPallets.value === null ? undefined : this.form.numberOfPallets.value,
			grossWeightKg: this.form.grossWeightKg.value === null ? undefined : this.form.grossWeightKg.value,
			volumeM3: this.form.volumeM3.value === null ? undefined : this.form.volumeM3.value,
		});
		this.freightLoadChange.emit(this.freightLoad);
	}
}
