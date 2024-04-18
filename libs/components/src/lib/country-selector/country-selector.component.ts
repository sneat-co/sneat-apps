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
import { countries, GeoRegion, ICountry, unknownCountry } from './countries';

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
	@Input() label = 'search';
	@Input() canBeUnknown = false;

	@Output() readonly countryIDChange = new EventEmitter<string>();

	constructor() {
		this.setCountries();
	}

	protected countries: ISelectItem[] = countries;

	protected geoRegion: GeoRegion | 'All' | 'Americas' = 'All';
	private geoRegions: (GeoRegion | 'All')[] = ['All'];

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

	onRegionChanged(): void {
		this.setCountries();
	}

	protected filterCountryByCode(item: ISelectItem, filter: string): boolean {
		const country = item as ICountry;
		return !!country.id3?.includes(filter.trim().toUpperCase());
	}

	private setCountries(): void {
		this.countries = countries.filter(
			(c) =>
				this.geoRegion === 'All' ||
				(this.geoRegion === 'Americas' &&
					(c.geoRegions.includes('North America') ||
						c.geoRegions.includes('South America'))) ||
				c.geoRegions.includes(this.geoRegion as GeoRegion),
		);
	}
}
