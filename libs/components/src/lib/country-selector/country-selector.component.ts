import { CommonModule } from '@angular/common';
import {
	Component,
	computed,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { countries, GeoRegion, ICountry, unknownCountry } from './countries';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
	imports: [CommonModule, FormsModule, IonicModule, SelectFromListComponent],
})
export class CountrySelectorComponent implements OnChanges {
	protected readonly geoRegions: readonly {
		readonly id: string;
		title?: string;
	}[] = [
		{ id: 'Europe' },
		{ id: 'Asia' },
		{ id: 'Americas' },
		{ id: 'Africa' },
	];

	@Input({ required: true }) countryID?: string;

	@Input() defaultCountryID?: string;

	@Input() readonly = false;
	@Input() disabled = false;
	@Input() label = 'search';
	@Input() canBeUnknown = false;

	@Output() readonly countryIDChange = new EventEmitter<string>();

	protected readonly filter = signal<string>('');
	protected readonly geoRegion = signal<GeoRegion | 'All' | 'Americas'>('All');

	protected readonly countries = computed<readonly ISelectItem[]>(() => {
		const filter = this.filter();
		let countriesToShow: readonly ISelectItem[] = filter
			? countries
			: countries.filter(
					(c) =>
						this.geoRegion() === 'All' ||
						(this.geoRegion() === 'Americas' &&
							(c.geoRegions.includes('North America') ||
								c.geoRegions.includes('South America'))) ||
						c.geoRegions.includes(this.geoRegion() as GeoRegion),
				);
		if (this.canBeUnknown) {
			countriesToShow = [...countriesToShow, unknownCountry];
		}
		return countriesToShow;
	});

	// protected geoRegion: GeoRegion | 'All' | 'Americas' = 'All';

	protected onChanged(): void {
		console.log('CountrySelectorComponent.onChanged()', this.countryID);
		this.countryIDChange.emit(this.countryID);
	}

	protected onFilterChanged(filter: string): void {
		console.log('CountrySelectorComponent.onFilterChanged()', filter);
		this.filter.set(filter);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['country'] && this.countryID === '--' && !this.canBeUnknown) {
			this.countryID = undefined;
		}
		if (
			changes['defaultCountryID'] &&
			!this.countryID &&
			this.defaultCountryID &&
			this.defaultCountryID !== '--'
		) {
			this.countryID = this.defaultCountryID;
			this.countryIDChange.emit(this.countryID);
		}
	}

	protected onRegionChanged(event: Event): void {
		this.geoRegion.set(
			(event as CustomEvent).detail.value as GeoRegion | 'All' | 'Americas',
		);
	}

	protected readonly filterCountryByCode = (
		item: ISelectItem,
		filter: string,
	) => {
		const f = filter.trim().toUpperCase();
		const c = item as ICountry;
		return c.id === f || c.id3.startsWith(f);
	};
}
