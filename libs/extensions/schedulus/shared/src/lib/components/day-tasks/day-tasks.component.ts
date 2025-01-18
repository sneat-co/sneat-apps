import { Component, Inject } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-day-tasks',
	templateUrl: './day-tasks.component.html',
})
export class DayTasksComponent {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger, // private readonly slotsProvider: ISlotsProvider,
	) {}

	// ngOnInit(): void {
	// this.slotsProvider.preloadEvents(undefined, new Date())
	// 	.subscribe(
	// 		slots => {
	// 			console.log('Loaded slots:', slots);
	// 		},
	// 		this.errorLogger.logError,
	// 	);
	// }
}
