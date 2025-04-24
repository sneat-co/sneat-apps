import { Component } from '@angular/core';
import { MemberBasePage } from '../member-base-page';
import { IMemberService } from 'sneat-shared/services/interfaces';
import { CommuneBasePageParams } from 'sneat-shared/services/params';

@Component({
	selector: 'sneat-member-budget',
	templateUrl: './member-budget-page.component.html',
	providers: [CommuneBasePageParams],
	standalone: false,
})
export class MemberBudgetPageComponent extends MemberBasePage {
	constructor(params: CommuneBasePageParams, membersService: IMemberService) {
		super(params, membersService);
	}
}
