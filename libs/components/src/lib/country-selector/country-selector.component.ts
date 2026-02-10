import {
	Component,
	computed,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { GeoRegion, ICountry } from './countries';
import { CountriesLoaderService } from './countries-loader.service';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
	imports: [FormsModule, SelectFromListComponent, IonSegment, IonSegmentButton],
})
export class CountrySelectorComponent implements OnInit, OnChanges {
	private readonly countriesLoader = inject(CountriesLoaderService);

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
	protected readonly allCountries = signal<readonly ICountry[]>([]);
	protected readonly unknownCountry = signal<ICountry | undefined>(undefined);

	protected readonly countries = computed<readonly ISelectItem[]>(() => {
		const allCountries = this.allCountries();
		if (allCountries.length === 0) {
			return []; // Data not loaded yet
		}

		const filter = this.filter();
		let countriesToShow: readonly ISelectItem[] = filter
			? allCountries
			: allCountries.filter(
					(c) =>
						this.geoRegion() === 'All' ||
						(this.geoRegion() === 'Americas' &&
							(c.geoRegions.includes('North America') ||
								c.geoRegions.includes('South America'))) ||
						c.geoRegions.includes(this.geoRegion() as GeoRegion),
				);
		if (this.canBeUnknown && this.unknownCountry()) {
			countriesToShow = [...countriesToShow, this.unknownCountry()!];
		}
		return countriesToShow;
	});

	ngOnInit(): void {
		// Load countries data
		this.countriesLoader.getCountries().then((countries) => {
			this.allCountries.set(countries);
		});
		this.countriesLoader.getUnknownCountry().then((unknown) => {
			this.unknownCountry.set(unknown);
		});
	}

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
