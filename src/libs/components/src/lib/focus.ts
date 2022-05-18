import { IonInput, IonRadioGroup } from '@ionic/angular';
import { IErrorLogger } from '@sneat/logging';

export function createSetFocusToInput(errorLogger: IErrorLogger) {
	return (input?: IonInput, delay = 100): void => {
		console.log('setFocusToInput()', input);
		if (!input) {
			console.error('can not set focus to undefined input');
			return;
		}
		setTimeout(
			() => {
				requestAnimationFrame(() => {
					console.log('focus to name input');
					input.setFocus()
						.catch(errorLogger.logErrorHandler('failed to set focus to input'));
				});
			},
			delay,
		);
	}
}
