import { Component } from '@angular/core';
// import {MembersBasePage} from '../../members-base-page';
// import {CommuneBasePageParams} from 'sneat-shared/services/params';

@Component({
	selector: 'sneat-pupils',
	templateUrl: './pupils-page.component.html',
	// providers: [CommuneBasePageParams],
})
export class PupilsPageComponent /*extends MembersBasePage*/ {
	segment: 'active' | 'archive' = 'active';

	// filteredMembers: ICommuneMemberInfo[] | undefined;

	applyFilter(filter: string): void {
		console.log('applyFilter', filter);
		// if (filter) {
		// 	const v = filter.toLowerCase();
		// 	this.filteredMembers = this.members.filter(m => m.title && m.title.toLowerCase()
		// 		.includes(v));
		// } else {
		// 	this.filteredMembers = undefined;
		// }
	}

	constructor() { // preloader: NgModulePreloaderService, // membersService: IMemberService, // params: CommuneBasePageParams,
		// super(params, membersService, preloader);
	}

	// get memberType(): MemberType {
	// 	return 'pupil';
	// }
}
