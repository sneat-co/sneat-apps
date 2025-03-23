import {
	inject,
	Inject,
	Injectable,
	InjectionToken,
	OnDestroy,
} from '@angular/core';
import { createSetFocusToInput } from '@sneat/components';
import { ErrorLogger } from '@sneat/logging';
import { MonoTypeOperatorFunction, Subject, Subscription, take } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface IConsole {
	log(...data: unknown[]): void;

	warn(...data: unknown[]): void;

	trace(...data: unknown[]): void;
}

export const ClassName = new InjectionToken<string>('className');

@Injectable()
export abstract class SneatBaseComponent implements OnDestroy {
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

	protected constructor(@Inject(ClassName) public readonly className: string) {
		this.console.log(`${this.className}.SneatBaseComponent.constructor()`);
		// this.logError = this.errorLogger.logError;
		// this.logErrorHandler = this.errorLogger.logErrorHandler;
	}

	protected takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.destroyed$);
	}

	public ngOnDestroy(): void {
		console.log(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		this.unsubscribe(`${this.className}.SneatBaseComponent.ngOnDestroy()`);
		// this.destroyed$?.pipe(take(1)).subscribe(() => {
		// 	console.log(`${this.className}.SneatBaseComponent => destroyed$!`);
		// });
		this.destroyed?.next();
		this.destroyed?.complete();
	}

	protected unsubscribe(reason?: string): void {
		this.console.log(
			`${this.className}.SneatBaseComponent.unsubscribe(reason: ${reason})`,
		);
		this.subs.unsubscribe();
	}
}
