import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { undefinedIfEmpty } from '@sneat/core';
import { IFreightLoad } from '../../dto';

export class FreightLoadForm {
	numberOfPallets = new FormControl<number>(0);
	grossWeightKg = new FormControl<number>(0);
	volumeM3 = new FormControl<number>(0);
	note = new FormControl<string>('');

	group = new FormGroup({
		numberOfPallets: this.numberOfPallets,
		grossWeightKg: this.grossWeightKg,
		volumeM3: this.volumeM3,
		note: this.note,
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
			const freightLoad = this.freightLoad;
			if (!this.form.numberOfPallets.dirty)
				this.form.numberOfPallets.setValue(freightLoad?.numberOfPallets || null);
			if (!this.form.grossWeightKg.dirty)
				this.form.grossWeightKg.setValue(freightLoad?.grossWeightKg || null);
			if (!this.form.volumeM3.dirty)
				this.form.volumeM3.setValue(freightLoad?.volumeM3 || null);
			if (!this.form.note.dirty) {
				this.form.note.setValue(freightLoad?.note || null);
			}
		}
	}

	onChanged(): void {
		this.freightLoad = undefinedIfEmpty({
			numberOfPallets: this.form.numberOfPallets.value === null ? undefined : this.form.numberOfPallets.value,
			grossWeightKg: this.form.grossWeightKg.value === null ? undefined : this.form.grossWeightKg.value,
			volumeM3: this.form.volumeM3.value === null ? undefined : this.form.volumeM3.value,
			note: this.form.note.value || undefined,
		});
		this.freightLoadChange.emit(this.freightLoad);
	}
}
