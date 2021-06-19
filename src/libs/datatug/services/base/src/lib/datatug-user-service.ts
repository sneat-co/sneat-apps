import {Injectable} from "@angular/core";
import {ISneatAuthState, ISneatUserState, SneatUserService} from "@sneat/auth";
import {Observable} from "rxjs";
import {IDatatugUser} from "@sneat/datatug/models";
import {map} from "rxjs/operators";
import {IUserRecord} from '@sneat/auth-models';

export interface IDatatugUserState extends ISneatUserState {
	record?: IDatatugUser;
}

@Injectable()
export class DatatugUserService {
	public datatugUserState: Observable<IDatatugUserState>;

	constructor(
		readonly sneatUserService: SneatUserService,
	) {
		if (!sneatUserService) {
			console.error('sneatUserService is not injected');
			return;
		}
		this.datatugUserState = sneatUserService.userState.pipe(
			map(sneatUserState => {
				console.log('DatatugUserService => sneatUserState:', sneatUserState);
				let datatugUser = sneatUserState?.record as IDatatugUser
					|| sneatUserState?.record === null && {title: ''};
				if (!datatugUser) {
					return sneatUserState as IDatatugUserState;
				}
				if (!datatugUser.datatug) {
					datatugUser = {...datatugUser, datatug: {stores: {}}}
				}
				if (!datatugUser.datatug.stores) {
					datatugUser = {...datatugUser, datatug: {stores: {}}}
				}
				const hasLocalhost = Object.keys(datatugUser.datatug.stores).some(v => v.startsWith('http://localhost:'));
				if (!hasLocalhost) {
					datatugUser.datatug.stores['http://localhost:8989'] = {
						type: 'agent',
						url: 'http://localhost:8989',
						title: 'localhost:8989'
					};
				}
				const datatugUserState: IDatatugUserState = {
					...sneatUserState,
					record: datatugUser,
				}
				return datatugUserState;
			}),
		);
	}
}
