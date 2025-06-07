import { inject, Injectable } from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';

@Injectable()
export class ContactusNavService {
	private readonly spaceNavService = inject(SpaceNavService);

	public navigateToAddMember = (space: ISpaceContext): Promise<boolean> =>
		this.spaceNavService.navigateForwardToSpacePage(space, 'add-member');

	public navigateToMember(memberContext: IContactContext): void {
		console.log(
			`navigateToMember(team.id=${memberContext?.space?.id}, memberInfo.id=${memberContext?.id})`,
		);
		// const id = `${memberContext?.space?.id}:${memberContext?.id}`;
		// const { space } = memberContext;
		// if (!space) {
		// 	this.errorLogger.logError(
		// 		'not able to navigate to member without team context',
		// 	);
		// 	return;
		// }
		// this.spaceNavService.navigateForwardToSpacePage(
		// 	space,
		// 	`member/${memberContext.id}`,
		// 	{
		// 		state: {
		// 			contact: memberContext,
		// 		},
		// 	},
		// );
	}
}
