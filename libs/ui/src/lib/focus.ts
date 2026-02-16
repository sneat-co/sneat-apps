import { IonInput, IonTextarea } from '@ionic/angular/standalone';
import { IErrorLogger } from '@sneat/core';

export function createSetFocusToInput(errorLogger: IErrorLogger) {
  return (input?: IonInput | IonTextarea, delay = 100): void => {
    if (!input) {
      console.error('can not set focus to undefined input');
      return;
    }
    setTimeout(() => {
      requestAnimationFrame(() => {
        // input.getInputElement().then(el => el.focus()).catch(errorLogger.logErrorHandler('failed to set focus to input'));
        input
          .setFocus()
          .catch(errorLogger.logErrorHandler('failed to set focus to input'));
      });
    }, delay);
  };
}
