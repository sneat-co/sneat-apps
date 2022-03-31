import { Component, Injectable, Input, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams, TeamContextComponent, TeamComponentContextModule } from '@sneat/team/components';
import { MemberService } from '@sneat/team/services';

@Injectable()
export class MemberComponentBaseParams {
	constructor(
		public readonly teamPageParams: TeamComponentBaseParams,
		public readonly membersService: MemberService,
	) {
	}
}

@Component({
	selector: 'sneat-member-context',
	template: '',
})
export class MemberContextComponent extends TeamContextComponent {

	constructor(
		params: MemberComponentBaseParams,
		route: ActivatedRoute,
	) {
		super(params.teamPageParams, route);
	}
}

@NgModule({
	imports: [
		TeamComponentContextModule,
	],
	declarations: [MemberContextComponent],
	exports: [MemberContextComponent],
})
export class MemberContextModule {

}
