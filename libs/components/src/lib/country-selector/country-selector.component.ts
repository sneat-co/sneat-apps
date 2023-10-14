import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ISelectItem } from '../selector';
import { SelectFromListModule } from '../selector/select-from-list';
import { countries, unknownCountry } from './countries';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, SelectFromListModule],
})
export class CountrySelectorComponent implements OnChanges {
	@Input({ required: true }) countryID?: string;

	@Input() readonly = false;
	@Input() disabled = false;
	@Input() label = 'Country';
	@Input() canBeUnknown = false;

	@Output() readonly countryIDChange = new EventEmitter<string>();

	protected countries: ISelectItem[] = countries;

	onChanged(): void {
		console.log('CountrySelectorComponent.onChanged()', this.countryID);
		this.countryIDChange.emit(this.countryID);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['canBeUnknown']) {
			this.countries = this.canBeUnknown
				? [...countries, unknownCountry]
				: countries;
		}
		if (changes['country'] && this.countryID === '--' && !this.canBeUnknown) {
			this.countryID = undefined;
		}
	}
}
