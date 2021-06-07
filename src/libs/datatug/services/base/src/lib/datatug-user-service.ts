import {Injectable} from "@angular/core";
import {SneatUserService} from "@sneat/auth";
import {Observable} from "rxjs";
import {IDatatugUser} from "@sneat/datatug/models";
import {map} from "rxjs/operators";

@Injectable()
export class DatatugUserService {
	public datatugUser: Observable<IDatatugUser>;

	constructor(
		readonly sneatUserService: SneatUserService,
	) {
		if (!sneatUserService) {
			console.error('sneatUserService is not injected');
			return;
		}
		this.datatugUser = sneatUserService.userRecord.pipe(
			map(sneatUserRecord => {
				let datatugUser = sneatUserRecord?.data as IDatatugUser;
				if (!datatugUser) {
					return datatugUser;
				}
				if (!datatugUser.datatug) {
					datatugUser = {...datatugUser, datatug: {stores: []}}
				}
				if (!datatugUser.datatug.stores) {
					datatugUser = {...datatugUser, datatug: {stores: []}}
				}
				if (!datatugUser.datatug.stores.length) {
					datatugUser.datatug.stores.push(
						{type: 'local', url: 'http://localhost:8989', title: 'localhost:8989'},
					);
				}
				return datatugUser;
			}),
		);
	}
}
