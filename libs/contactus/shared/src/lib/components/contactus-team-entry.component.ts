import {
	Component,
	Inject,
	Input,
	OnDestroy,
	WritableSignal,
} from '@angular/core';
import { ContactusTeamService } from '@sneat/contactus-services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamBaseComponent } from '@sneat/team/components';
import { IContactusTeamDtoAndID, ITeamContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-contactus-team-entry',
	template: '',
	standalone: true,
}) // TODO(stackoverflow): Ask better way to do it.
export class ContactusTeamEntryComponent
	extends TeamBaseComponent
	implements OnDestroy
{
	@Input({ required: true }) team?: ITeamContext;
	@Input({ required: true }) signal?: WritableSignal<
		IContactusTeamDtoAndID | undefined
	>;

	protected contactusTeamSubscription?: Subscription;
	protected contactusTeamEntry?: IContactusTeamDtoAndID;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly contactusTeamService: ContactusTeamService,
	) {
		super('ContactusTeamEntryComponent', errorLogger);
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.contactusTeamSubscription?.unsubscribe();
	}

	protected override onTeamIdChanged(): void {
		this.contactusTeamSubscription?.unsubscribe();
		const team = this.$team();
		if (!team) {
			return;
		}
		this.contactusTeamSubscription = this.contactusTeamService
			.watchTeamModuleRecord(team)
			.subscribe({
				next: (value) => {
					this.contactusTeamEntry = value;
					this.signal?.set(value);
				},
			});
	}
}
