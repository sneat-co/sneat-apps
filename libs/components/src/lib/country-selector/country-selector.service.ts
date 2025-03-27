import { Injectable } from '@angular/core';
import { SelectorBaseService } from '@sneat/ui';
import { ICountry } from './countries';
import { CountrySelectorComponent } from './country-selector.component';

@Injectable()
export class CountrySelectorService extends SelectorBaseService<ICountry> {
	constructor() {
		super(CountrySelectorComponent);
	}
}
