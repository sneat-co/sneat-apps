import {Component, Inject, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IDatatugUser} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DatatugUserService} from "@sneat/datatug/services/base";

@Component({
	selector: 'datatug-my',
	templateUrl: './datatug-my-page.component.html',
	styleUrls: ['./datatug-my-page.component.scss'],
})
export class DatatugMyPageComponent implements OnDestroy {

	public datatugUser: IDatatugUser;
	private destroyed = new Subject<void>();

	constructor(
		readonly datatugUserService: DatatugUserService,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
	) {
		datatugUserService.datatugUser.pipe(
			takeUntil(this.destroyed),
		).subscribe({
			next: datatugUser => {
				this.datatugUser = datatugUser;
			},
			error: errorLogger.logErrorHandler('Failed to get user record for MyPage'),
		});
	}

	ngOnDestroy(): void {
		if (this.destroyed) {
			this.destroyed.next();
			this.destroyed.complete();
		}
	}

}
