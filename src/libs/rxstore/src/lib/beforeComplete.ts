// import {Observable, Operator, OperatorFunction, Subscribable, Subscriber} from 'rxjs';
//
// interface NextObserver<T> {
// 	closed?: boolean;
// 	next: (value: T) => void;
// 	// tslint:disable-next-line:no-any
// 	error?: (err: any) => void;
// 	complete?: () => void;
// }
//
// interface ErrorObserver<T> {
// 	closed?: boolean;
// 	next?: (value: T) => void;
// 	// tslint:disable-next-line:no-any
// 	error: (err: any) => void;
// 	complete?: () => void;
// }
//
// interface CompletionObserver<T> {
// 	closed?: boolean;
// 	next?: (value: T) => void;
// 	// tslint:disable-next-line:no-any
// 	error?: (err: any) => void;
// 	complete: () => void;
// }
//
// type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;
//
// class BeforeCompleteSubscriber<T> extends Subscriber<T> {
// 	constructor(
// 		private readonly callback: () => void,
// 		// tslint:disable-next-line:no-any
// 		destinationOrNext?: PartialObserver<any> | ((value: T) => void),
// 		// tslint:disable-next-line:no-any
// 		error?: (e?: any) => void,
// 		complete?: () => void,
// 	) {
// 		super(destinationOrNext);
// 	}
//
// 	protected _complete(): void {
// 		this.callback();
// 		super._complete();
// 	}
// }
//
// class BeforeCompleteOperator<T, R> implements Operator<T, R> {
// 	constructor(private readonly callback: () => void) {
// 	}
//
// 	// tslint:disable-next-line:no-any
// 	call(subscriber: Subscriber<R>, source: Subscribable<any>): any {
// 		return source.subscribe(new BeforeCompleteSubscriber(this.callback, subscriber));
// 	}
// }
//
// // tslint:disable-next-line:no-any
// export function beforeComplete(callback: () => void): OperatorFunction<any, never> {
// 	// tslint:disable-next-line:no-any
// 	return function beforeCompleteOperatorFunction(source: Observable<any>): Observable<never> {
// 		// tslint:disable-next-line:no-inferred-empty-object-type
// 		return source.lift(new BeforeCompleteOperator(callback));
// 	};
// }
//
