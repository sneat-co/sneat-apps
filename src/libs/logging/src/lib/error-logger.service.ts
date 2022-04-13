import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as Sentry from '@sentry/browser';
import { IErrorLogger, ILogErrorOptions } from './error-logger.interface';

const defaultErrorToastDuration = 7000;

@Injectable()
export class ErrorLoggerService implements IErrorLogger {
	constructor(
		private readonly toastController: ToastController,
	) {
	}

	public readonly logErrorHandler =
		(message?: string, options?: ILogErrorOptions) => (e: any) =>
			this.logError(e, message, options);

	public logError = (
		e: any,
		message?: string,
		options?: ILogErrorOptions,
	): { error: any; message?: string } | any => {
		console.error(`${message || 'Error'}:`, e, options);
		if (e === true || e === false) {
			try {
				throw new Error(`got boolean value as an error: ${e}: ${message}`);
			} catch (ex) {
				console.error('Argument exception at logError():', ex, options);
				return;
			}
		}
		if (!options || options.report === undefined || options.report) {
			try {
				const eventId = Sentry.captureException(e);
				if (!options || options.feedback === undefined || options.feedback) {
					Sentry.showReportDialog({ eventId });
				}
			} catch (ex) {
				console.error(
					'Sentry failed to capture or show  error report dialog',
					ex,
				);
			}
		}
		if (options?.show === undefined || options.show) {
			if (e.message) {
				message = (message && `${message}: ${e.message}`) || e.message;
			} else if (!message) {
				message = e.toString();
			}
			this.showError(message as string, options?.showDuration);
		}
		return message ? { error: e, message } : e;
	};

	public showError(message: string, duration?: number): void {
		if (!message) {
			throw new Error('showError() have not received a message to display');
		}
		if (duration && duration < 0) {
			throw new Error('showError received negative duration');
		}
		this.toastController
			.create({
				message,
				duration: duration || defaultErrorToastDuration,
				keyboardClose: true,
				buttons: [
					{
						icon: 'close',
						side: 'end',
						handler: () =>
							this.toastController.dismiss().catch((e) =>
								this.logError(e, 'Failed to dismiss error dialog', {
									show: false,
								}),
							),
					},
				],
				color: 'danger',
				header: 'Something went wrong',
				position: 'top',
			})
			.then((toast) =>
				toast
					.present()
					.catch(
						this.logErrorHandler(
							'Failed to present toast with error message:',
							{ show: false },
						),
					),
			)
			.catch(
				this.logErrorHandler(
					'Failed to create a toast dialog with error message:',
					{ show: false },
				),
			);
	}
}
