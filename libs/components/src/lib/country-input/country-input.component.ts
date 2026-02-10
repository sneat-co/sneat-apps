import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { ICountry, CountriesLoaderService } from '../country-selector';

@Component({
	selector: 'sneat-country-input',
	templateUrl: './country-input.component.html',
	imports: [
		FormsModule,
		IonItem,
		IonSelect,
		IonSelectOption,
		IonButtons,
		IonButton,
		IonIcon,
	],
})
export class CountryInputComponent implements OnInit {
	private readonly countriesLoader = inject(CountriesLoaderService);

	@Input() canReset = true;
	@Input() label = 'Country';
	@Input() countryID = '';
	@Output() countryIDChange = new EventEmitter<string>();

	readonly countries = signal<readonly ICountry[]>([]);

	ngOnInit(): void {
		// Load countries data
		this.countriesLoader.getCountries().then((countries) => {
			this.countries.set(countries);
		});
	}

	// constructor(
	// 	// private readonly countrySelectorService: CountrySelectorService,
	// ) {
	// }

	public onCountryChanged(): void {
		console.log('CountryInputComponent.onCountryChanged()', this.countryID);
		this.countryIDChange.emit(this.countryID);
	}

	reset(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.countryID = '';
		this.countryIDChange.emit('');
	}

	// protected openCountrySelector(): void {
	// 	// const options: ISelectorOptions<ICountry> = {
	// 	// 	items: of(countries),
	// 	// };
	// 	// this.countrySelectorService
	// 	// 	.selectSingleInModal(options)
	// 	// 	.then();
	// }
}
