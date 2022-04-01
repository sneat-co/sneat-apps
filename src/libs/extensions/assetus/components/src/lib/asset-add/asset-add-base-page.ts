import { FormControl, FormGroup, Validators } from '@angular/forms';

export abstract class AssetAddBasePage {
	country = 'ie';

	titleForm = new FormGroup({
		title: new FormControl('', Validators.required),
	});
}
