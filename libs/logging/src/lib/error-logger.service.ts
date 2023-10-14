import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { captureException, showReportDialog } from '@sentry/angular-ivy';
import { IErrorLogger, ILogErrorOptions } from './interfaces';

const defaultErrorToastDuration = 7000;

@Injectable()
export class ErrorLoggerService implements IErrorLogger {
	constructor(
		private readonly toastController: ToastController,
	) {
	}

	public readonly logErrorHandler =
		(message?: string, options?: ILogErrorOptions) => (e: unknown) =>
			this.logError(e, message, options);

	public readonly logError = (
		e: unknown,
		message?: string,
		options?: ILogErrorOptions,
	): void => {
		console.error(`ErrorLoggerService.logError: ${message || 'Error'}:`, e, '; Logging options:', options);
		if (e === true || e === false) {
			try {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`got boolean value as an error: ${e}: ${message}`);
			} catch (ex) {
				console.error('Argument exception at logError():', ex, options);
				return;
			}
		}
		const feedback = options?.feedback === undefined || options.feedback;
		if (options?.report === undefined || options.report) {
			if (window.location.hostname !== 'localhost' && feedback) {
				try {
					const eventId = captureException(e);
					console.log('Captured error by Sentry with eventId:', eventId);
					if (options?.feedback === undefined || options.feedback) {
						showReportDialog({ eventId });
					}
				} catch (ex) {
					console.error(
						'Sentry failed to capture or show  error report dialog',
						ex,
					);
				}

			}
		}
		if (options?.show === undefined || options.show) {
			if ((e as { message?: string }).message) {
				message =
					(message && `${message}: ${(e as { message?: string }).message}`)
					|| (e as { message?: string }).message;
			} else if (!message) {
				message = (e as object).toString();
			}
			if (message) {
				console.log('e:', e instanceof HttpErrorResponse);
				if (e instanceof HttpErrorResponse) {
					this.showError({
						clientMessage: message,
						serverMessage: e.error?.error?.message,
					}, options?.showDuration);
				}
			}
		}
		return; // return message ? { error: e, message } : e;
	};

	public showError(details: { clientMessage: string; serverMessage?: string }, duration?: number): void {
		if (!details.clientMessage) {
			throw new Error('showError() have not received a message to display');
		}
		if (duration && duration < 0) {
			throw new Error('showError received negative duration');
		}
		let message = details.clientMessage;
		if (details.serverMessage) {
			message += `.\n\nServer returned error message: ${details.serverMessage}`;
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
