import { IonInput, IonTextarea } from '@ionic/angular';
import { IErrorLogger } from '@sneat/logging';

export function createSetFocusToInput(errorLogger: IErrorLogger) {
	return (input?: IonInput | IonTextarea, delay = 100): void => {
		console.log('setFocusToInput()', input?.name, delay);
		if (!input) {
			console.error('can not set focus to undefined input');
			return;
		}
		setTimeout(() => {
			requestAnimationFrame(() => {
				console.log('focusing to input ', input.name);
				// input.getInputElement().then(el => el.focus()).catch(errorLogger.logErrorHandler('failed to set focus to input'));
				input
					.setFocus()
					.catch(errorLogger.logErrorHandler('failed to set focus to input'));
			});
		}, delay);
	};
}
