import { Component } from '@angular/core';
import { IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-day-tasks',
	templateUrl: './day-tasks.component.html',
})
export class DayTasksComponent {
	constructor(
		private readonly errorLogger: IErrorLogger, // private readonly slotsProvider: ISlotsProvider,
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
