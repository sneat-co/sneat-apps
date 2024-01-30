import { Component } from '@angular/core';
import { MembersBasePage } from '../../members-base-page';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { IMemberService } from 'sneat-shared/services/interfaces';
import { NgModulePreloaderService } from 'sneat-shared/services/ng-module-preloader.service';
import { MemberType } from 'sneat-shared/models/types';
import { IRecord, RxRecordKey } from 'rxstore';

@Component({
	selector: 'sneat-staff',
	templateUrl: './staff-page.component.html',
	providers: [CommuneBasePageParams],
})
export class StaffPageComponent extends MembersBasePage {
	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
	) {
		super(params, membersService, preloader);
	}

	readonly memberType: MemberType = 'staff';

	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}

	goNewStaff(): void {
		this.navigateForward('new-staff');
	}
}
