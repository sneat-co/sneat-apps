import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IDatatugUser} from "@sneat/datatug/models";
import {map, shareReplay} from "rxjs/operators";
import {ISneatUserState, SneatUserService} from '@sneat/user';
import {RandomId} from '@sneat/random';

export interface IDatatugUserState extends ISneatUserState {
	record?: IDatatugUser;
}

@Injectable({providedIn: 'root'})
export class DatatugUserService {
	public datatugUserState: Observable<IDatatugUserState>;

	private readonly id = RandomId.newRandomId(5);

	constructor(
		readonly sneatUserService: SneatUserService,
	) {
		if (!sneatUserService) {
			console.error('sneatUserService is not injected');
			return;
		}
		this.datatugUserState = sneatUserService.userState.pipe(
			map(sneatUserState => {
				// console.log(`DatatugUserService(id=${this.id}) => sneatUserState:`, sneatUserState);
				let datatugUser = sneatUserState?.record as IDatatugUser
					|| sneatUserState?.record === null && {title: ''};
				if (!datatugUser) {
					return sneatUserState as IDatatugUserState;
				}
				if (!datatugUser.datatug) {
					datatugUser = {
						...datatugUser,
						datatug: {stores: {}},
					};
				}
				if (!datatugUser.datatug.stores) {
					datatugUser = {
						...datatugUser,
						datatug: {stores: {}},
					};
				}
				const datatugUserState: IDatatugUserState = {
					...sneatUserState,
					record: datatugUser,
				}
				return datatugUserState;
			}),
			shareReplay(1),
		);
	}
}
