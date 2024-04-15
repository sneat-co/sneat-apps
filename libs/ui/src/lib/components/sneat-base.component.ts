import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { createSetFocusToInput } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject, Subscription } from 'rxjs';

export interface IConsole {
	log(...data: unknown[]): void;
	warn(...data: unknown[]): void;
	trace(...data: unknown[]): void;
}

@Injectable()
export abstract class SneatBaseComponent implements OnDestroy {
	// Signals that the component is destroyed and should not be used anymore
	protected readonly destroyed = new Subject<void>();
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

	public ngOnDestroy(): void {
		this.unsubscribe(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		this.destroyed.next();
		this.destroyed.complete();
	}

	protected unsubscribe(reason?: string): void {
		this.console.log(
			`${this.className}.SneatBaseComponent.unsubscribe(reason: ${reason})`,
		);
		this.subs.unsubscribe();
	}
}
