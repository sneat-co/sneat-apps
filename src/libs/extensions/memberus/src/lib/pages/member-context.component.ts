import { Component, Injectable, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams, TeamPageContextComponent, TeamPageContextModule } from '@sneat/team/components';

@Injectable()
export class MemberComponentBaseParams {
	constructor(
		public readonly teamPageParams: TeamComponentBaseParams,
		// public readonly membersService: IMemberService,
	) {
	}
}

@Component({
	selector: 'sneat-member-context',
	template: '',
})
export class MemberContextComponent extends TeamPageContextComponent {

	constructor(
		params: MemberComponentBaseParams,
		route: ActivatedRoute,
	) {
		super(params.teamPageParams, route);
	}
}

@NgModule({
	imports: [
		TeamPageContextModule,
	],
	declarations: [MemberContextComponent],
	exports: [MemberContextComponent],
})
export class MemberContextModule {

}
