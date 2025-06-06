import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IDatatugUser } from '@sneat/ext-datatug-models';
import { map, shareReplay } from 'rxjs/operators';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { newRandomId } from '@sneat/random';

export interface IDatatugUserState extends ISneatUserState {
	record?: IDatatugUser;
}

@Injectable()
export class DatatugUserService {
	readonly sneatUserService = inject(SneatUserService);

	public datatugUserState: Observable<IDatatugUserState>;

	private readonly id = newRandomId({ len: 5 });

	constructor() {
		const sneatUserService = this.sneatUserService;

		if (!sneatUserService) {
			throw new Error('sneatUserService is not injected');
		}
		this.datatugUserState = sneatUserService.userState.pipe(
			map((sneatUserState) => {
				// console.log(`DatatugUserService(id=${this.id}) => sneatUserState:`, sneatUserState);
				let datatugUser =
					(sneatUserState?.record as IDatatugUser) ||
					(sneatUserState?.record === null && { title: '' });
				if (!datatugUser) {
					return sneatUserState as IDatatugUserState;
				}
				if (!datatugUser.datatug) {
					datatugUser = {
						...datatugUser,
						datatug: { stores: {} },
					};
				}
				if (!datatugUser?.datatug?.stores) {
					datatugUser = {
						...datatugUser,
						datatug: { stores: {} },
					};
				}
				const datatugUserState: IDatatugUserState = {
					...sneatUserState,
					record: datatugUser,
				};
				return datatugUserState;
			}),
			shareReplay(1),
		);
	}
}
