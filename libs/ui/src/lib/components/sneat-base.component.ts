import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { createSetFocusToInput } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MonoTypeOperatorFunction, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface IConsole {
	log(...data: unknown[]): void;

	warn(...data: unknown[]): void;

	trace(...data: unknown[]): void;
}

@Injectable()
export abstract class SneatBaseComponent implements OnDestroy {
	private readonly destroyed = new Subject<void>();
	// Signals that the component is destroyed and should not be used anymore
	protected readonly destroyed$ = this.destroyed.asObservable();

	// All active subscriptions of a component. Will be unsubscribed on destroy
	protected readonly subs = new Subscription();
	// Passes focus to the input element
	protected readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	protected readonly console: IConsole = console;

	protected constructor(
		@Inject(new InjectionToken('className')) public readonly className: string,
		@Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
	) {
		this.console.log(`${this.className}.SneatBaseComponent.constructor()`);
	}

	protected takeUntilNeeded<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.destroyed$);
	}

	public ngOnDestroy(): void {
		console.log(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		this.destroyed$.subscribe(() => {
			console.log(`${this.className}.SneatBaseComponent => destroyed$!`);
		});
		this.destroyed.next();
		this.destroyed.complete();
		this.unsubscribe(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
	}

	protected unsubscribe(reason?: string): void {
		this.console.log(
			`${this.className}.SneatBaseComponent.unsubscribe(reason: ${reason})`,
		);
		this.subs.unsubscribe();
	}
}
