import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { createSetFocusToInput } from '../focus';
import { ErrorLogger } from '@sneat/logging';
import { MonoTypeOperatorFunction, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface IConsole {
	log(...data: unknown[]): void;

	warn(...data: unknown[]): void;

	trace(...data: unknown[]): void;

	error(...data: unknown[]): void;
}

export const ClassName = new InjectionToken<string>('className');

@Injectable()
export abstract class SneatBaseComponent implements OnDestroy {
	// protected $isInitialized = signal(false);
	//
	// // eslint-disable-next-line @angular-eslint/contextual-lifecycle
	// public ngOnInit() {
	// 	console.info(`${this.className}.SneatBaseComponent.ngOnInit()`);
	// 	// $isInitialized is for workaround for https://angular.dev/errors/NG0950
	// 	// Required input is accessed before a value is set.
	// 	// Might be excessive and should be removed if we can find a better way.
	// 	this.$isInitialized.set(true);
	// }

	private readonly destroyed = new Subject<void>();
	// Signals that the component is destroyed and should not be used anymore
	protected readonly destroyed$ = this.destroyed.asObservable();

	// All active subscriptions of a component. Will be unsubscribed on destroy
	protected readonly subs = new Subscription();

	protected readonly console: IConsole = console;

	protected readonly errorLogger = inject(ErrorLogger);

	protected readonly logError = this.errorLogger.logError;
	protected readonly logErrorHandler = this.errorLogger.logErrorHandler;

	// Passes focus to the input element
	protected readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	protected readonly className = inject(ClassName);

	protected constructor() {
		this.log(`${this.className}.SneatBaseComponent.constructor()`);
	}

	protected log(msg: string, ...data: unknown[]): void {
		this.console.log(msg, ...data);
	}

	// protected readonly takeUntilDestroyed = <T>() =>
	// 	takeUntil<T>(this.destroyed$);
	protected takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.destroyed$);
	}

	public ngOnDestroy(): void {
		this.log(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		this.unsubscribe(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		this.destroyed?.next();
		this.destroyed?.complete();
	}

	protected unsubscribe(reason?: string): void {
		this.log(
			`${this.className}.SneatBaseComponent.unsubscribe(reason: ${reason})`,
		);
		this.subs.unsubscribe();
	}
}
