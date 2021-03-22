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
		this.datatugUser = sneatUserService.userRecord.pipe(
			map(sneatUserRecord => {
				let datatugUser = sneatUserRecord?.data as IDatatugUser;
				if (!datatugUser) {
					return datatugUser;
				}
				if (!datatugUser.dataTug) {
					datatugUser = {...datatugUser, dataTug: {stores: []}}
				}
				if (!datatugUser.dataTug.stores) {
					datatugUser = {...datatugUser, dataTug: {stores: []}}
				}
				if (!datatugUser.dataTug.stores.length) {
					datatugUser.dataTug.stores.push(
						{type: 'local', url: 'http://localhost:8989', title: 'localhost:8989'},
					);
				}
				return datatugUser;
			}),
		);
	}
}
