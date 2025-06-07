import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { captureException, showReportDialog } from '@sentry/angular';
import { IErrorLogger, ILogErrorOptions } from './interfaces';

const defaultErrorToastDuration = 7000;

@Injectable()
export class ErrorLoggerService implements IErrorLogger {
	private readonly toastController = inject(ToastController);

	public readonly logErrorHandler =
		(message?: string, options?: ILogErrorOptions) => (e: unknown) =>
			this.logError(e, message, options);

	public readonly logError = (
		e: unknown,
		message?: string,
		options?: ILogErrorOptions,
	): void => {
		console.error(
			`ErrorLoggerService.logError: ${message || 'Error'}:`,
			e,
			'; Logging options:',
			options,
		);
		if (e === true || e === false) {
			try {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`got boolean value as an error: ${e}: ${message}`);
			} catch (ex) {
				console.error('Argument exception at logError():', ex, options);
				return;
			}
		}
		if (options?.report === undefined || options.report) {
			if (window.location.hostname !== 'localhost') {
				try {
					const eventId = message
						? captureException(message, { originalException: e })
						: captureException(e);

					// console.log('Captured error by Sentry with eventId:', eventId);
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
		if (options?.show || options?.show === undefined) {
			this.showError(e, options?.showDuration);
		}
		return; // return message ? { error: e, message } : e;
	};

	public showError(e: unknown, duration?: number): void {
		let clientMessage: string | undefined;

		if ((e as { message?: string }).message) {
			clientMessage =
				(clientMessage &&
					`${clientMessage}: ${(e as { message?: string }).message}`) ||
				(e as { message?: string }).message;
		} else if (!clientMessage) {
			clientMessage = (e as object).toString();
		}
		if (!clientMessage) {
			throw new Error('showError() have not received a message to display');
		}
		if (duration && duration < 0) {
			throw new Error('showError received negative duration');
		}

		let message = clientMessage;

		const serverMessage: string | undefined =
			e instanceof HttpErrorResponse ? e.error?.error?.message : undefined;
		if (serverMessage) {
			message += `.\n\nServer returned error message: ${serverMessage}`;
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
				this.logErrorHandler('Failed to create a toast with error message:', {
					show: false,
				}),
			);
	}
}
