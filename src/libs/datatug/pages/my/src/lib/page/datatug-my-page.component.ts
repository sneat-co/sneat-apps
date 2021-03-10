import {Component, Inject, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IDataTugUser} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {SneatUserService} from '@sneat/auth';

@Component({
	selector: 'datatug-my',
	templateUrl: './datatug-my-page.component.html',
	styleUrls: ['./datatug-my-page.component.scss'],
})
export class DatatugMyPageComponent implements OnDestroy {

	public dataTugUser: IDataTugUser;
	private destroyed = new Subject<void>();

	constructor(
		readonly userService: SneatUserService,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
	) {
		userService.userRecord.pipe(takeUntil(this.destroyed)).subscribe({
			next: sneatUser => {
				console.log('sneatUser:', sneatUser);
				this.dataTugUser = sneatUser?.data as IDataTugUser;
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
