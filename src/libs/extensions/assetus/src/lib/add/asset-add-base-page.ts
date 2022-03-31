//tslint:disable:no-unbound-method
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';

export abstract class AssetAddBasePage extends CommuneBasePage {
	country = 'ie';

	titleForm = new FormGroup({
		title: new FormControl('', Validators.required),
	});
}
