import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { defaultFamilyMemberExtensions, ISneatExtension } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';

@Component({
	selector: 'sneat-contact-modules-menu',
	templateUrl: 'contact-modules-menu.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactModulesMenuComponent {
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) public contact?: IContactContext;

	public readonly extensions = defaultFamilyMemberExtensions;

	constructor(
		private readonly teamNavService: TeamNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	protected goExt(ext: ISneatExtension): void {
		console.warn('not implemented go()', ext);
	}

	protected goNew(event: Event, ext: ISneatExtension): void {
		event.preventDefault();
		event.stopPropagation();
		const team = this.team,
			contact = this.contact;
		if (!team || !ext.newPage || !contact?.id) {
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(team, ext.newPage, {
				queryParams: { contact: contact?.id },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to extension "new" page',
				),
			);
	}
}
