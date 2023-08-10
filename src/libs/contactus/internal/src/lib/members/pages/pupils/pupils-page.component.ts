import {Component} from '@angular/core';
import {MembersBasePage} from '../../members-base-page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IMemberService} from 'sneat-shared/services/interfaces';
import {NgModulePreloaderService} from 'sneat-shared/services/ng-module-preloader.service';
import {MemberType} from 'sneat-shared/models/types';
import {ICommuneMemberInfo} from '../../../../models/dto/dto-commune';

@Component({
	selector: 'sneat-pupils',
	templateUrl: './pupils-page.component.html',
	providers: [CommuneBasePageParams],
})
export class PupilsPageComponent extends MembersBasePage {

	segment: 'active' | 'archive' = 'active';

	filteredMembers: ICommuneMemberInfo[] | undefined;

	applyFilter(filter: string): void {
		if (filter) {
			const v = filter.toLowerCase();
			this.filteredMembers = this.members.filter(m => m.title && m.title.toLowerCase()
				.indexOf(v) >= 0);
		} else {
			this.filteredMembers = undefined;
		}
	}

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
	) {
		super(params, membersService, preloader);
	}

	get memberType(): MemberType {
		return 'pupil';
	}
}
