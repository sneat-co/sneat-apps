import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SelectorBaseService } from '../selector';
import { ICountry } from './countries';
import { CountrySelectorComponent } from '.';

@Injectable()
export class CountrySelectorService extends SelectorBaseService<ICountry> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(CountrySelectorComponent, errorLogger, modalController);
	}
}
